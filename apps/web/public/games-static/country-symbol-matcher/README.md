# Country Symbol Match ❄️

A winter-themed puzzle game that tests geography knowledge and spatial awareness. Players clear the board by matching country flags to their corresponding national symbols, but a match is only valid if a clear, unblocked path can be drawn between the two tiles.

## 🎮 How to Play

- **Match Pairs:** Select a Country Flag and match it to its corresponding National Symbol.
- **The Path Rule:** You can only connect two matching tiles if a clear, unblocked path can be drawn between them through empty spaces on the board.
- **Turn Limits:** The connecting path can have a maximum of **2 turns** (up to 3 straight lines). Paths can travel outside the outer boundary of the board.
- **Strategy:** Clear tiles on the outer edges first to open up paths for the inside tiles!

## ✨ Features

- **Classic Onet Mechanics:** Implements Breadth-First Search (BFS) pathfinding to validate complex tile connections.
- **Guaranteed Solvability:** The game intelligently monitors the board state. If you ever run out of valid moves, the board automatically reshuffles remaining tiles behind the scenes so you never get stuck.
- **Responsive Design:** A beautiful, glassmorphism UI that automatically scales to perfectly fit any screen size (desktop or mobile).
- **Procedural Audio:** Sound effects are generated natively in the browser using the Web Audio API—no external audio files required!
- **Celebratory Effects:** Features continuous background snowfall and a massive confetti celebration upon winning.

## 🚀 Running Locally

1. Clone this repository.
2. Serve the directory using any local web server. For example:
   ```bash
   # Using Python
   python3 -m http.server 3000
   
   # Using Node (npx)
   npx serve .
   ```
3. Open `http://localhost:3000` in your browser.

## 🛠️ Built With
- HTML5
- CSS3 (Vanilla)
- JavaScript (ES6+)
- [canvas-confetti](https://github.com/catdad/canvas-confetti)
