# Rooftop Pursuit: Night Operations 🎯

A premium, highly-optimized 3D WebGL sniper game built with React, Three.js, and React Three Fiber (R3F). Features fully dynamic UI (Glassmorphism), cinematic lighting, and custom physics hit-registration without any physics engine overhead.

## 🚀 Features
- **Cinematic Landing & UI**: Breathtaking initial landing screen, responsive dual-thumb mobile controls, glowing neon glitch typography.
- **Optimized 3D Engine**: Runs flawlessly at 60 FPS on mobile. Uses procedural generated canvas textures to avoid heavy asset downloading.
- **Custom Precision Hitbox**: Implements an advanced Mathematical Vertical Capsule Hitbox using `distToSegment3D` to ensure absolute accuracy on varying distances without a heavy physics library (like Rapier or Cannon).
- **Responsive Controls**: Fully supports WASD + Mouse for desktop, and Virtual Dual-Thumb Joystick + Touch Fire buttons for Mobile.
- **Dynamic Quiz Integration**: Integrated with a custom Quiz API to deliver live targets. 

## 🛠️ Tech Stack
- **React 18** & **Vite**
- **Three.js** & **@react-three/fiber**
- **Zustand** (Global State Management)
- **Vanilla CSS** (No heavy Tailwind, pure Glassmorphism CSS)

## 📦 Setup & Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Environment:
   Create a `.env` file in the root directory:
   ```env
   VITE_QUIZ_API_URL=https://your-quiz-api-url.com
   ```

3. Start Development Server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

## ⚙️ Building for Production
```bash
npm run build
```
This generates the highly compressed bundle in the `dist` folder.

## 🌐 Deploy to GitHub Pages
This project includes a fully configured `.github/workflows/deploy.yml`. 
To deploy:
1. Push to `main` branch.
2. Go to your GitHub Repository Settings > Pages.
3. Set the Source to **GitHub Actions**.
4. (Optional) Set your `VITE_QUIZ_API_URL` under Settings > Secrets and Variables > Actions > Variables.
5. GitHub will automatically build and deploy your game!
