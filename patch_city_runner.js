const fs = require('fs');
const js = fs.readFileSync('g:/Ishuu/Admin project_company_ready/apps/web/public/games-static/city-runner/assets/index-Dr6cWhj7.js', 'utf8');

const s1 = 'className:`score-badge`,children:[`⭐ `,o]';
const r1 = 'className:`score-badge`,children:[`Q: `,n+1,`/`,e.length,` \\xA0 ⭐ `,o]';

const s2 = 'className:`score-badge`,style:{fontSize:`0.78rem`,padding:`3px 10px`},children:[`⭐ `,o]';
const r2 = 'className:`score-badge`,style:{fontSize:`0.78rem`,padding:`3px 10px`},children:[`Q: `,n+1,`/`,e.length,` \\xA0 ⭐ `,o]';

let modified = false;
let newJs = js;
if (newJs.includes(s1)) {
    newJs = newJs.replace(s1, r1);
    console.log('Replaced s1');
    modified = true;
}
if (newJs.includes(s2)) {
    newJs = newJs.replace(s2, r2);
    console.log('Replaced s2');
    modified = true;
}

if (modified) {
    fs.writeFileSync('g:/Ishuu/Admin project_company_ready/apps/web/public/games-static/city-runner/assets/index-Dr6cWhj7.js', newJs);
    console.log('Saved');
}
