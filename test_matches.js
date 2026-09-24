const fs = require('fs');
const js = fs.readFileSync('g:/Ishuu/Admin project_company_ready/apps/web/public/games-static/platformer/assets/index-CA8TfBMY.js', 'utf8');

const s1 = /\(0,b\.jsxs\)\(`div`,\{style:\{textAlign:`right`\},children:\[\(0,b\.jsxs\)\(`div`,\{children:\[`Score: `,\(0,b\.jsx\)\(`strong`,\{style:\{color:`var\(--primary\)`\},children:o\}\)\]\}\),\(0,b\.jsxs\)\(`div`,\{children:\[`Streak: `,c\]\}\)\]\}\)/;
console.log('Desktop match:', !!js.match(s1));

const s2 = /\(0,b\.jsxs\)\(`div`,\{style:\{fontSize:`0\.9rem`,textAlign:`center`,fontWeight:`bold`\},children:\[`Score: `,\(0,b\.jsx\)\(`strong`,\{style:\{color:`var\(--primary\)`\},children:o\}\),` \\xA0\|\\xA0 Streak: `,c\]\}\)/;
console.log('Mobile match:', !!js.match(s2));
