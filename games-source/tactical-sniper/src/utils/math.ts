// ─────────────────────────────────────────────────────────────────
//  MATH UTILITIES (Zero-GC Optimization)
// ─────────────────────────────────────────────────────────────────

export function secureRandom(): number {
  return Math.random();
}

/** Compute 3D ballistic points along a launch trajectory */
export function ballisticTrajectory3D(
  origin: [number, number, number],
  velocity: [number, number, number],
  gravity: number,
  steps: number,
  timeStep: number
): [number, number, number][] {
  const points: [number, number, number][] = [];
  let px = origin[0];
  let py = origin[1];
  let pz = origin[2];
  let vx = velocity[0];
  let vy = velocity[1];
  let vz = velocity[2];

  for (let i = 0; i < steps; i++) {
    points.push([px, py, pz]);
    px += vx * timeStep;
    py += vy * timeStep;
    pz += vz * timeStep;
    vy -= gravity * timeStep;
  }

  return points;
}

/** 3D Distance from point to line segment */
export function distToSegment3D(
  px: number, py: number, pz: number,
  x1: number, y1: number, z1: number,
  x2: number, y2: number, z2: number
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dz = z2 - z1;
  const lenSq = dx * dx + dy * dy + dz * dz;

  if (lenSq === 0) return Math.hypot(px - x1, py - y1, pz - z1);

  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy + (pz - z1) * dz) / lenSq));
  const projX = x1 + t * dx;
  const projY = y1 + t * dy;
  const projZ = z1 + t * dz;

  return Math.hypot(px - projX, py - projY, pz - projZ);
}
