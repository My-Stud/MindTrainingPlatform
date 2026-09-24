# Institute Orbit 🎯

Aim, bounce, and shoot your way to mastering India's premier Research Institutes and their locations in this premium, neon-infused arcade game! Built with a modern dark theme and custom physics, players drag a central golden joystick puck to fire bouncing bullets at target option orbs in the corners.

## Features ✨

- **🕹️ 360° Central Joystick**: Aim and shoot in any direction using a high-fidelity, interactive golden joystick puck with a glowing neon indicator.
- **🔮 Diagonal Glassmorphic Orbs**: Locations are written directly inside glossy, 3D option balls positioned in the diagonals around the joystick.
- **💥 Physics-Based Bouncing**: Fire bullets that realistically bounce off walls and borders to hit targets. Features custom prediction trails!
- **🏆 Arcade Scoring & Feedback**: 
  - Earn **+100 points** for correct answers and trigger a massive confetti blast.
  - Suffer a **-10 points** penalty for wrong answers (clamped at 0) which triggers a screen shake on the joystick outer ring.
- **💡 Smart Lifelines**: Enable the **50/50** lifeline to blast away two incorrect options, or open the **Mnemonic (Hint)** modal when stuck.
- **📱 Fully Mobile Responsive**: Adaptable layouts with dynamic math scaling that automatically scales components on smaller devices (like iPhone SE) and removes borders/rounded corners for a clean edge-to-edge phone viewport.

## Tech Stack 🛠️

- **Structure**: Vanilla HTML5 (Semantic elements)
- **Styling**: Vanilla CSS3 (Custom radial gradients, neon glows, glassmorphism, keyframe animations)
- **Logic**: Vanilla ES6 Javascript (HTML5 Canvas Confetti API, custom 2D bouncing vector physics, pointer/touch events)

## Quick Start 🚀

No setup or build tools required! 

1. Clone this repository:
   ```bash
   git clone <your-repo-url>
   ```
2. Open `index.html` directly in any web browser, or host it locally using Python:
   ```bash
   python3 -m http.server
   ```
3. Open `http://localhost:8000` and start shooting!

## How to Play 🎮

1. Read the research institute name shown at the top of the screen.
2. Drag the central **golden puck** inside the purple ring to aim.
3. Release the puck to fire a bullet in the targeted direction.
4. Hit the correct location orb to gain points and advance!
