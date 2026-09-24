# 🌵 CactiQuiz 3D

CactiQuiz 3D is an interactive, highly visual 3D vocabulary quiz game built with React Three Fiber, Vite, and TypeScript. Test your knowledge by selecting the correct definition from four charming 3D cactuses!

## 🚀 Features

- **True 3D Environment**: Fully 3D models procedurally generated using React Three Fiber.
- **Dynamic Animations**: Watch the "nuts" fly from the cactus to the HUD when you get the correct answer, and see them shake if you guess wrong.
- **Responsive Layout**: Plays beautifully on both desktop (horizontal row) and mobile (2x2 grid) browsers.
- **Audio Effects**: Built-in synthesized sounds (Web Audio API) for clicks, success, and errors—no external audio files required.
- **Game Logic**: Score tracking (+100 for correct, -10 for wrong), with a maximum of 2 wrong attempts before automatically advancing.
- **State Management**: Built efficiently using Zustand for reactive game state.
- **Premium UI**: Glassmorphic, modern HUD overlaid seamlessly on top of the 3D canvas.

## 🛠️ Technology Stack

- **React**: UI architecture.
- **TypeScript**: Full static typing across the codebase.
- **Vite**: Ultra-fast build tool and development server.
- **Three.js & React Three Fiber**: For rendering and composing the 3D scene and geometries.
- **Framer Motion**: For smooth, polished 2D UI animations.
- **Zustand**: Lightweight global state management.

## 📦 Installation & Setup

1. Clone the repository and navigate into the project directory:
   ```bash
   git clone <repository_url>
   cd game8
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 🎮 How to Play

1. At the bottom of the screen, you'll see a definition.
2. Read the words displayed on the 4 3D cactuses in front of you.
3. Click the cactus that displays the correct word for the given definition.
4. If correct, you'll see the nuts fly up to the UI, you'll score 100 points, and the next question will load.
5. If incorrect, the cactus will shake and turn red, and you'll lose 10 points. You get up to 2 wrong attempts per question!
6. After 10 questions, see your final score.
