import { useRef, useEffect, forwardRef, useImperativeHandle, useCallback, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Hud, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { GAME_CONFIG } from '../gameConfig';
import { RooftopAudio } from '../../audio/RooftopAudioManager';
import { useGameStore } from '../gameStore';
import type { KeyState } from '../../controls/useKeyboard';

const CFG = GAME_CONFIG;

export interface PoliceOfficerHandle {
  getPosition:  () => THREE.Vector3;
  getAimYaw:    () => number;
  getAimPitch:  () => number;
  fireWeapon:   () => void;
  setScoped:    (v: boolean) => void;
}

interface Props {
  keys:           React.MutableRefObject<KeyState>;
  fireSignal:     React.MutableRefObject<boolean>;
  onShootBullet?: (origin: THREE.Vector3, velocity: THREE.Vector3) => void;
  paused:         boolean;
  onScopeChange?: (scoped: boolean) => void;
}

// ── Reusable Vectors (Zero GC Allocation) ─────────────────────────
const _muzzle   = new THREE.Vector3();
const _bvel     = new THREE.Vector3();
const _moveDir  = new THREE.Vector2();

const LOOK_SENS = 0.0024;
const HIP_FOV   = typeof window !== 'undefined' && window.innerWidth < 768 ? 95 : 72;
const SCOPE_FOV = 12; // Extremely powerful 6x zoom for 150m distant targets!

export const PoliceOfficer = forwardRef<PoliceOfficerHandle, Props>(
  ({ keys, onShootBullet, fireSignal, paused, onScopeChange }, ref) => {
    const { camera } = useThree();
    const phase = useGameStore((s) => s.phase);

    // ── Character Physical Position on Rooftop (Safe Nest at 38m) ─
    const posX     = useRef(CFG.police.baseX);
    const posY     = CFG.police.baseY; // 38.0m
    const posZ     = useRef(CFG.police.baseZ); // -2.2m (safe stance behind railing)
    const eyeY     = posY + 1.65; // Standing eye level = 39.65m
    const velX     = useRef(0);
    const velZ     = useRef(0);

    // ── Aim Angles (Standard FPS: yaw horizontal, pitch vertical) ───
    const aimYaw   = useRef(0.0);
    const aimPitch = useRef(-0.25); // ~15° natural downward view over city

    const isScoped   = useRef(false);
    const [fovState, setFovState] = useState(HIP_FOV);
    const currentFov = useRef(HIP_FOV);

    // Drag Tracking
    const lastPX = useRef(0);
    const lastPY = useRef(0);
    const isDown = useRef(false);

    // Recoil / Flash
    const recoilT = useRef(0);
    const flashT  = useRef(0);

    // Viewmodel & Legs Hierarchy
    const vmRef      = useRef<THREE.Group>(null);
    const flashRef   = useRef<THREE.Mesh>(null);
    const flightRef  = useRef<THREE.PointLight>(null);
    const legsRef    = useRef<THREE.Group>(null);

    // ── Shoot Function (Dedicated Fire Button / Spacebar) ──────────
    const shootGun = useCallback(() => {
      const cam = camera as THREE.PerspectiveCamera;
      const dir = new THREE.Vector3();
      cam.getWorldDirection(dir);

      _muzzle.set(posX.current + dir.x * 1.5, eyeY + dir.y * 1.5, posZ.current + dir.z * 1.5);
      _bvel.copy(dir).multiplyScalar(CFG.gun.bulletSpeed);

      recoilT.current = 0.15;
      flashT.current  = 0.08;
      RooftopAudio.play('gunshot');
      onShootBullet?.(_muzzle.clone(), _bvel.clone());
    }, [onShootBullet, eyeY]);

    useImperativeHandle(ref, () => ({
      getPosition: () => new THREE.Vector3(posX.current, eyeY, posZ.current),
      getAimYaw:   () => aimYaw.current,
      getAimPitch: () => aimPitch.current,
      fireWeapon:  shootGun,
      setScoped:   (v: boolean) => {
        isScoped.current = v;
        onScopeChange?.(v);
      },
    }));

    // ── Standard BGMI Non-Inverted Drag Look Controls ──────────────
    useEffect(() => {
      if (phase === 'countdown') {
        aimYaw.current = 0;
        aimPitch.current = 0;
        posX.current = 0;
        posZ.current = 0;
      }
    }, [phase]);

    useEffect(() => {
      const onPointerDown = (e: PointerEvent) => {
        if (paused) return;
        const el = e.target as HTMLElement;
        if (el.closest?.('button, .bgmi-squad-panel, .control-bar, .joystick-zone')) return;
        lastPX.current = e.clientX;
        lastPY.current = e.clientY;
        isDown.current = true;
      };

      const onPointerMove = (e: PointerEvent) => {
        if (paused || !isDown.current) return;
        const el = e.target as HTMLElement;
        if (el.closest?.('button, .bgmi-squad-panel, .control-bar, .joystick-zone')) return;

        const sens = isScoped.current ? LOOK_SENS * 0.20 : LOOK_SENS;
        const dx = e.clientX - lastPX.current;
        const dy = e.clientY - lastPY.current;
        lastPX.current = e.clientX;
        lastPY.current = e.clientY;

        // Standard Natural FPS Aiming
        aimYaw.current   += dx * sens;
        aimPitch.current  = Math.max(CFG.gun.minPitch, Math.min(CFG.gun.maxPitch, aimPitch.current - dy * sens));
      };

      const onPointerUp = () => { isDown.current = false; };

      window.addEventListener('pointerdown',   onPointerDown, { passive: true });
      window.addEventListener('pointermove',   onPointerMove, { passive: true });
      window.addEventListener('pointerup',     onPointerUp,   { passive: true });
      window.addEventListener('pointercancel', onPointerUp,   { passive: true });
      return () => {
        window.removeEventListener('pointerdown',   onPointerDown);
        window.removeEventListener('pointermove',   onPointerMove);
        window.removeEventListener('pointerup',     onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);
      };
    }, [paused]);

    // ── Per-Frame Game Loop: Camera-Relative Movement, FPP Camera, Viewmodel ──
    useFrame((_, delta) => {
      const dt = Math.min(delta, 0.05);

      if (fireSignal.current) {
        fireSignal.current = false;
        shootGun();
      }

      // ── Camera-Relative Movement with Safe Boundaries ────────────
      if (!paused) {
        const { left, right, up, down } = keys.current;
        const { acceleration: acc, deceleration: dec, maxSpeed, minX, maxX, minZ, maxZ } = CFG.police;

        const fwdX =  Math.sin(aimYaw.current);
        const fwdZ = -Math.cos(aimYaw.current);
        const rgtX =  Math.cos(aimYaw.current);
        const rgtZ =  Math.sin(aimYaw.current);

        const inputZ = (up ? 1 : 0) - (down ? 1 : 0);
        const inputX = (right ? 1 : 0) - (left ? 1 : 0);

        _moveDir.set(
          fwdX * inputZ + rgtX * inputX,
          fwdZ * inputZ + rgtZ * inputX
        );

        if (_moveDir.lengthSq() > 0.001) {
          _moveDir.normalize();
          velX.current = THREE.MathUtils.lerp(velX.current, _moveDir.x * maxSpeed, acc * dt * 0.2);
          velZ.current = THREE.MathUtils.lerp(velZ.current, _moveDir.y * maxSpeed, acc * dt * 0.2);
        } else {
          velX.current = THREE.MathUtils.lerp(velX.current, 0, dec * dt * 0.2);
          velZ.current = THREE.MathUtils.lerp(velZ.current, 0, dec * dt * 0.2);
        }

        posX.current = Math.max(minX, Math.min(maxX, posX.current + velX.current * dt));
        posZ.current = Math.max(minZ, Math.min(maxZ, posZ.current + velZ.current * dt));
      }

      // ── Recoil Animation ─────────────────────────────────────────
      let kick = 0;
      if (recoilT.current > 0) {
        recoilT.current -= dt;
        const f = recoilT.current / 0.15;
        kick = f * 0.15;
      }

      // ── Muzzle Flash Light ───────────────────────────────────────
      if (flashT.current > 0) {
        flashT.current -= dt;
        if (flightRef.current) flightRef.current.intensity = 15.0;
        if (flashRef.current)  flashRef.current.visible = true;
      } else {
        if (flightRef.current) flightRef.current.intensity = 0;
        if (flashRef.current)  flashRef.current.visible = false;
      }

      // ── 1. Drive Main FPP Camera ───────────────────────
      const cam = camera as THREE.PerspectiveCamera;
      cam.position.set(posX.current, eyeY, posZ.current);

      // Smooth Scope FOV transition
      const targetFov = isScoped.current ? SCOPE_FOV : HIP_FOV;
      currentFov.current = THREE.MathUtils.lerp(currentFov.current, targetFov, dt * 12);
      cam.fov = currentFov.current;
      cam.updateProjectionMatrix();

      // Sync HUD camera FOV state to match main camera
      if (Math.abs(fovState - currentFov.current) > 0.5) {
        setFovState(currentFov.current);
      }

      // Breathing idle sway
      const t = Date.now() * 0.001;
      const swayAmt = isScoped.current ? 0.0002 : 0.0016;
      const breathYaw   = Math.sin(t * 1.2) * swayAmt;
      const breathPitch = Math.cos(t * 1.8) * swayAmt * 0.7;

      // Rotate Main Camera
      cam.rotation.set(
        aimPitch.current + kick + breathPitch,
        -aimYaw.current + breathYaw,
        0,
        'YXZ'
      );

      // ── 2. Update Lower Body on Rooftop Floor (Looking Down) ──────
      if (legsRef.current) {
        legsRef.current.position.set(posX.current, posY, posZ.current);
        legsRef.current.rotation.y = -aimYaw.current;
      }

      // ── 3. Position Sleek Tactical Sniper Rifle in HUD (Separate Scene) ──
      const vm = vmRef.current;
      if (vm) {
        // Hide weapon mesh during 6x scope for crystal clear telescopic sightline
        vm.visible = !isScoped.current;

        if (vm.visible) {
          // HUD Camera is fixed at [0,0,0] looking down -Z.
          const targetX = 0.22;
          const targetY = -0.20;
          const targetZ = -0.44; // Notice negative Z for forward!

          const bobX = Math.sin(t * 1.2) * 0.0012;
          const bobY = Math.cos(t * 2.4) * 0.0016;

          vm.position.set(
            targetX + bobX,
            targetY + bobY - kick * 0.04,
            targetZ + kick * 0.06 // kick backwards (+Z)
          );

          // Apply recoil kick rotation (pitch up)
          vm.rotation.set(kick * 0.4, 0.015, -0.02);
        }
      }
    });

    const NAVY      = '#1e293b'; // Dark blue duty uniform
    const GLOVE     = '#111827';
    const CARBON    = '#09090b';
    const BOOT      = '#090d16';
    const GUNMETAL  = '#27272a'; // Realistic dark metal
    const DARKSTEEL = '#3f3f46';
    const BRIGHTSTL = '#a1a1aa'; // Shiny barrel metal

    return (
      <>
        {/* ── 1. LOWER BODY (Legs, Boots on Rooftop Floor - Main Scene) ── */}
        <group ref={legsRef}>
          {/* Left Leg & Combat Boot */}
          <group position={[-0.18, 0, 0]}>
            <mesh position={[0, 0.60, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.10, 0.55, 10]} />
              <meshStandardMaterial color={NAVY} roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.32, -0.08]}>
              <boxGeometry args={[0.14, 0.14, 0.06]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            <mesh position={[0, 0.18, 0]} castShadow>
              <cylinderGeometry args={[0.10, 0.08, 0.35, 10]} />
              <meshStandardMaterial color={NAVY} roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.06, -0.06]} castShadow>
              <boxGeometry args={[0.15, 0.12, 0.30]} />
              <meshStandardMaterial color={BOOT} roughness={0.4} />
            </mesh>
          </group>

          {/* Right Leg & Combat Boot */}
          <group position={[0.18, 0, 0]}>
            <mesh position={[0, 0.60, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.10, 0.55, 10]} />
              <meshStandardMaterial color={NAVY} roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.32, -0.08]}>
              <boxGeometry args={[0.14, 0.14, 0.06]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            <mesh position={[0, 0.18, 0]} castShadow>
              <cylinderGeometry args={[0.10, 0.08, 0.35, 10]} />
              <meshStandardMaterial color={NAVY} roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.06, -0.06]} castShadow>
              <boxGeometry args={[0.15, 0.12, 0.30]} />
              <meshStandardMaterial color={BOOT} roughness={0.4} />
            </mesh>
          </group>
        </group>

        {/* ── 2. VIEWMODEL (Rendered in HUD overlay scene so it NEVER clips into walls!) ── */}
        <Hud renderPriority={1}>
          <PerspectiveCamera makeDefault position={[0, 0, 0]} fov={fovState} near={0.01} far={10} />
          
          {/* Tactical Studio Lighting & Environment for Realistic Metal Reflections */}
          <ambientLight intensity={1.5} />
          <directionalLight position={[2, 5, 2]} intensity={3.0} />
          <directionalLight position={[-2, -2, 2]} intensity={2.0} color="#e0f2fe" />
          <Environment preset="city" />
          
          <group ref={vmRef}>
            {/* Right Arm (Holding Pistol Grip & Trigger) */}
            <group position={[0.13, -0.09, 0.14]} rotation={[0.48, -0.14, -0.05]}>
              {/* Short Sleeve (prevents camera clipping) */}
              <mesh position={[0, -0.10, 0]}>
                <cylinderGeometry args={[0.062, 0.055, 0.16, 10]} />
                <meshStandardMaterial color={NAVY} roughness={0.8} />
              </mesh>
              {/* Tactical Glove */}
              <mesh position={[0, -0.24, 0]}>
                <cylinderGeometry args={[0.052, 0.048, 0.20, 10]} />
                <meshStandardMaterial color={GLOVE} roughness={0.9} />
              </mesh>
              {/* Carbon Knuckle Guard */}
              <mesh position={[0, -0.34, 0.02]}>
                <boxGeometry args={[0.065, 0.04, 0.065]} />
                <meshStandardMaterial color={CARBON} roughness={0.4} metalness={0.6} />
              </mesh>
            </group>

            {/* Left Arm (Holding Handguard Support) */}
            <group position={[-0.08, -0.11, 0.10]} rotation={[0.44, 0.16, 0.07]}>
              {/* Short Sleeve (prevents camera clipping) */}
              <mesh position={[0, -0.10, 0]}>
                <cylinderGeometry args={[0.062, 0.055, 0.16, 10]} />
                <meshStandardMaterial color={NAVY} roughness={0.8} />
              </mesh>
              {/* Tactical Glove */}
              <mesh position={[0, -0.24, 0]}>
                <cylinderGeometry args={[0.052, 0.048, 0.20, 10]} />
                <meshStandardMaterial color={GLOVE} roughness={0.9} />
              </mesh>
              {/* Carbon Knuckle Guard */}
              <mesh position={[0, -0.34, 0.02]}>
                <boxGeometry args={[0.065, 0.04, 0.065]} />
                <meshStandardMaterial color={CARBON} roughness={0.4} metalness={0.6} />
              </mesh>
            </group>

            {/* ── SLEEK TACTICAL SNIPER RIFLE MODEL ── */}
            <group position={[0, 0, 0]}>
              {/* Main Upper/Lower Matte Gunmetal Receiver */}
              <mesh position={[0, 0, -0.06]}>
                <boxGeometry args={[0.038, 0.068, 0.36]} />
                <meshStandardMaterial color={GUNMETAL} roughness={0.6} metalness={0.5} />
              </mesh>

              {/* Top Picatinny Rail System */}
              <mesh position={[0, 0.038, -0.08]}>
                <boxGeometry args={[0.024, 0.010, 0.38]} />
                <meshStandardMaterial color={DARKSTEEL} roughness={0.5} metalness={0.7} />
              </mesh>

              {/* Realistic Cylindrical Telescopic Sniper Scope */}
              <group position={[0, 0.068, -0.06]}>
                {/* Scope Main Body Tube */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.018, 0.018, 0.24, 14]} />
                  <meshStandardMaterial color={DARKSTEEL} roughness={0.5} metalness={0.8} />
                </mesh>
                {/* Scope Front Objective Bell */}
                <mesh position={[0, 0, -0.12]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.024, 0.018, 0.06, 14]} />
                  <meshStandardMaterial color={GUNMETAL} roughness={0.5} metalness={0.8} />
                </mesh>
                {/* Scope Front Lens (Glass Reflection) */}
                <mesh position={[0, 0, -0.15]} rotation={[Math.PI / 2, 0, 0]}>
                  <circleGeometry args={[0.022, 16]} />
                  <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.9} />
                </mesh>
                {/* Scope Rear Eyepiece */}
                <mesh position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.018, 0.022, 0.05, 14]} />
                  <meshStandardMaterial color={GUNMETAL} roughness={0.5} metalness={0.8} />
                </mesh>
                {/* Scope Mounting Rings */}
                <mesh position={[0, -0.016, -0.05]}>
                  <boxGeometry args={[0.026, 0.022, 0.02]} />
                  <meshStandardMaterial color={DARKSTEEL} roughness={0.5} metalness={0.8} />
                </mesh>
                <mesh position={[0, -0.016, 0.05]}>
                  <boxGeometry args={[0.026, 0.022, 0.02]} />
                  <meshStandardMaterial color={DARKSTEEL} roughness={0.5} metalness={0.8} />
                </mesh>
              </group>

              {/* Long Fluted Sniper Barrel */}
              <mesh position={[0, 0.012, -0.42]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.012, 0.014, 0.48, 12]} />
                <meshStandardMaterial color={BRIGHTSTL} roughness={0.3} metalness={0.9} />
              </mesh>

              {/* Tactical Muzzle Brake Compensator */}
              <mesh position={[0, 0.012, -0.66]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.018, 0.016, 0.06, 12]} />
                <meshStandardMaterial color={DARKSTEEL} roughness={0.6} metalness={0.7} />
              </mesh>

              {/* M-LOK Handguard Shroud */}
              <mesh position={[0, 0.010, -0.28]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.028, 0.028, 0.28, 8]} />
                <meshStandardMaterial color={GUNMETAL} roughness={0.6} metalness={0.5} />
              </mesh>

              {/* Curved Steel 30-Round Magazine */}
              <mesh position={[0, -0.09, -0.06]} rotation={[0.25, 0, 0]}>
                <boxGeometry args={[0.028, 0.15, 0.065]} />
                <meshStandardMaterial color={DARKSTEEL} roughness={0.6} metalness={0.7} />
              </mesh>

              {/* Ergonomic Textured Pistol Grip */}
              <mesh position={[0, -0.07, 0.06]} rotation={[-0.35, 0, 0]}>
                <boxGeometry args={[0.032, 0.11, 0.045]} />
                <meshStandardMaterial color={CARBON} roughness={0.8} metalness={0.2} />
              </mesh>

              {/* Tactical Precision Skeleton Stock */}
              <mesh position={[0, 0.008, 0.20]}>
                <boxGeometry args={[0.032, 0.08, 0.20]} />
                <meshStandardMaterial color={GUNMETAL} roughness={0.6} metalness={0.5} />
              </mesh>
              <mesh position={[0, 0.035, 0.18]}>
                <boxGeometry args={[0.034, 0.02, 0.12]} />
                <meshStandardMaterial color={CARBON} roughness={0.8} metalness={0.2} />
              </mesh>

              {/* Dynamic Muzzle Flash Point Light & Flame */}
              <pointLight ref={flightRef} position={[0, 0.012, -0.70]} color="#fef08a" intensity={0} distance={4} />
              <mesh ref={flashRef} position={[0, 0.012, -0.72]} visible={false}>
                <dodecahedronGeometry args={[0.13, 0]} />
                <meshBasicMaterial color="#fef08a" />
              </mesh>
            </group>
          </group>
        </Hud>
      </>
    );
  }
);

PoliceOfficer.displayName = 'PoliceOfficer';
