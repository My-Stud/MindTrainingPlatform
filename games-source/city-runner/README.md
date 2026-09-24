# City Runner

**An immersive, fast-paced educational platformer where you sprint, jump, and dodge deadly obstacles to answer trivia in a stunning 3D cityscape.**

## Features
- **Action-Packed Trivia:** Answer questions by physically navigating a stickman through a vibrant 2D side-scrolling city, dodging incorrect answers (deadly spike-wheels) and landing on the correct one.
- **Dynamic Terrain & Physics:** Run across procedurally generated rolling hills, utilizing physics-based jumping, gravity, and even dynamic hair physics.
- **Modern Glassmorphism UI:** Features a premium, sleek glass-panel interface that perfectly frames the action.
- **Powerups:** 
  - **50/50:** Instantly collapse two incorrect spike-wheels into black holes without breaking your stride.
  - **Hint:** Displays a contextual hint to help you survive.
- **Fully Responsive:** Play flawlessly on desktop or mobile. The internal canvas dynamically scales to any screen size without distortion.
- **Retro Audio Feedback:** Fully synthesized retro game sounds (jumping, correct, wrong) using the native Web Audio API.

## Getting Started

First, install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```
The game will run locally on `http://localhost:3000`.

## Build & Deploy

Build the production app:
```bash
npm run build
```
This generates the optimized bundle in the `dist` folder. You can test it locally with `npm run preview`.

## Technologies Used
- React (Hooks, State Management)
- HTML5 Canvas API (Custom Physics, Parallax Backgrounds, Dynamic Rendering)
- TypeScript (Strict typing for game entities and API responses)
- CSS3 (Glassmorphism, Responsive Design)
- Web Audio API (Synthesized SFX)
