const fs = require('fs');
const path = 'g:/Ishuu/Admin project_company_ready/apps/web/public/games-static/platformer/assets/index-CA8TfBMY.js';
let js = fs.readFileSync(path, 'utf8');

const s1 = /\(0,b\.jsxs\)\(`div`,\{style:\{textAlign:`right`\},children:\[\(0,b\.jsxs\)\(`div`,\{children:\[`Score: `,\(0,b\.jsx\)\(`strong`,\{style:\{color:`var\(--primary\)`\},children:o\}\)\]\}\),\(0,b\.jsxs\)\(`div`,\{children:\[`Streak: `,c\]\}\)\]\}\)/;
const rep1 = '(0,b.jsxs)(`div`,{style:{textAlign:`right`},children:[(0,b.jsxs)(`div`,{children:[`Q: `,n+1,`/`,e.length]}),(0,b.jsxs)(`div`,{children:[`Score: `,(0,b.jsx)(`strong`,{style:{color:`var(--primary)`},children:o})]}),(0,b.jsxs)(`div`,{children:[`Streak: `,c]})]})';

const s2 = /\(0,b\.jsxs\)\(`div`,\{style:\{fontSize:`0\.9rem`,textAlign:`center`,fontWeight:`bold`\},children:\[`Score: `,\(0,b\.jsx\)\(`strong`,\{style:\{color:`var\(--primary\)`\},children:o\}\),` \\xA0\|\\xA0 Streak: `,c\]\}\)/;
const rep2 = '(0,b.jsxs)(`div`,{style:{fontSize:`0.9rem`,textAlign:`center`,fontWeight:`bold`},children:[`Q: `,n+1,`/`,e.length,` \\xA0|\\xA0 Score: `,(0,b.jsx)(`strong`,{style:{color:`var(--primary)`},children:o}),` \\xA0|\\xA0 Streak: `,c]})';

let modified = false;
if (js.match(s1)) {
    js = js.replace(s1, rep1);
    modified = true;
    console.log("Patched Desktop HUD");
}
if (js.match(s2)) {
    js = js.replace(s2, rep2);
    modified = true;
    console.log("Patched Mobile HUD");
}

if (modified) {
    fs.writeFileSync(path, js);
    console.log("Saved patched JS.");
} else {
    console.log("No matches found. Maybe already patched?");
}
