const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'public/games-static/trivia-smash/assets/index-DiMjKh4A.js');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Auto-unpause game on mount so balls & paddle immediately move
if (content.includes('[c,f]=ce.useState(0),[h,d]=ce.useState(!0)')) {
  content = content.replace('[c,f]=ce.useState(0),[h,d]=ce.useState(!0)', '[c,f]=ce.useState(0),[h,d]=ce.useState(!1)');
  console.log('✔ Unpaused game on mount');
}

fs.writeFileSync(filePath, content, 'utf8');

// 2. Update index.html cache busting
const htmlPath = path.resolve(__dirname, 'public/games-static/trivia-smash/index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace(/\?v=[^"']+/g, `?v=live_${Date.now()}`);
fs.writeFileSync(htmlPath, html, 'utf8');

console.log('✔ Successfully patched trivia-smash for instant autoplay and live questions!');
