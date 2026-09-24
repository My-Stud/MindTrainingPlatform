// ─────────────────────────────────────────────────────────────────
//  GAME CONFIG — Ultra-Long Range Sniper (120m - 150m Distance)
// ─────────────────────────────────────────────────────────────────

export const GAME_CONFIG = {
  // Police Sniper Vantage Point with Safe Platform & Railing
  police: {
    baseX: 0.0,
    baseY: 38.0,   // Elevated rooftop height
    baseZ: -2.2,    // Safe stance behind front railing
    minX: -6.3,    // Allow movement to left railing
    maxX: 6.3,    // Allow movement to right railing
    minZ: -3.25,   // Allow movement right up to the front railing
    maxZ: 8.5,    // Allow movement back
    maxSpeed: 6.0,
    acceleration: 50,
    deceleration: 42,
  },

  // High-Velocity Long-Range Sniper Ballistics
  gun: {
    bulletSpeed: 220.0,  // Ultra-fast supersonic bullet for 150m distance
    gravity: 1.5,    // Subtle bullet drop
    minYaw: -1.7,
    maxYaw: 1.7,
    minPitch: -1.25,   // downward viewing angle
    maxPitch: 0.45,   // upward viewing angle
    hitRadius: 1.4,    // precise hitbox width (capsule based)
    maxAge: 4.0,    // bullet lifetime
  },

  // 4 Distant, Widely-Separated Suspect Towers (120m - 150m Range)
  suspects: [
    // A: Red hoodie — Far-Left flank tower (150m away)
    { id: 'A', name: 'Red Thief', building: 'NEXUS SPIRE', posX: -55.0, roofY: 18.0, posZ: -125.0, rotY: 0.55 },
    // B: Blue hoodie — Center-Left deep tower (140m away)
    { id: 'B', name: 'Blue Thief', building: 'CYBER METRO', posX: -18.0, roofY: 18.0, posZ: -140.0, rotY: 0.20 },
    // C: Amber hoodie — Center-Right deep tower (140m away)
    { id: 'C', name: 'Amber Thief', building: 'APEX FINANCIAL', posX: 18.0, roofY: 18.0, posZ: -140.0, rotY: -0.20 },
    // D: Purple hoodie — Far-Right flank tower (150m away)
    { id: 'D', name: 'Purple Thief', building: 'TITAN INDUSTRIAL', posX: 55.0, roofY: 18.0, posZ: -125.0, rotY: -0.55 },
  ],

  scoring: {
    correct: 100,
    wrong: -25,
    miss: -10,
    streakBonus: 50,
  },

  timing: {
    countdownSeconds: 3,
    resolvingDelayMs: 3000,
  },
};
