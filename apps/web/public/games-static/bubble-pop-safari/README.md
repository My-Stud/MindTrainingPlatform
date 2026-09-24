# Bubble Pop Safari

A browser-based bubble pop game with 3 levels: Bubble Shooter, Magic Bucket Words, and Wizard's Cauldron.

## How to Run

### Option 1: Direct Open (Recommended)
Simply double-click `index.html` to open it in your default browser.

### Option 2: Local Server (if direct open has issues)
```bash
# Python 3
python -m http.server 8000

# Node.js (if installed)
npx http-server

# PHP
php -S localhost:8000
```
Then open `http://localhost:8000` in your browser.

## Required Software
- A modern web browser (Chrome, Firefox, Edge, or Safari)
- Internet connection (for Google Fonts)

No installation or dependencies required.

## Project Structure
```
bubble-pop-safari/
  index.html       - Main HTML entry point
  game.js          - All game logic (bubble shooter, levels, scoring)
  styles.css       - Canvas styling
  background.png   - In-game background image
  homepage.png     - Menu/home screen background image
  README.md        - This file
```

## How to Play

### Level 1 - Bubble Shooter
- **Drag** to aim, **release** to shoot
- Match 3+ bubbles of the same number to pop them
- Pop all bubbles to complete the level
- Each pop earns 10 points, disconnect bonuses earn 5 points

### Level 2 - Magic Bucket Words
- Tap the numbered balloons that correspond to each letter of the word
- Follow the letter-to-number mapping shown in the legend
- Complete all words to finish the level

### Level 3 - Wizard's Cauldron
- Same as Level 2, but letters are brewed in a magical cauldron
- Watch the brewing animation as letters are converted

## Troubleshooting

### Game doesn't load or shows a blank screen
- Make sure you have an internet connection (Google Fonts must load)
- Try opening `index.html` in a different browser
- Clear your browser cache and reload

### No sound
- Click anywhere on the game first (browsers require user interaction before playing audio)
- Check that your browser tab is not muted

### Images not loading
- Ensure both `background.png` and `homepage.png` are in the same folder as `index.html`
- Do not rename or move the image files

### Game feels laggy
- Close other browser tabs to free up resources
- The game renders on an HTML5 Canvas and performs best in modern browsers

### Progress not saving
- The game uses `localStorage` to save level progress and scores
- If using private/incognito mode, progress will not persist between sessions

## Technical Notes
- All audio is generated via the Web Audio API (no external audio files needed)
- The game includes a `roundRect` polyfill for older browser compatibility
- Google Fonts used: Baloo 2, Fredoka, Lilita One, Nunito, Luckiest Guy
- Works on both desktop and mobile (touch events supported)
