const fs = require('fs');
const js = fs.readFileSync('g:/Ishuu/Admin project_company_ready/apps/web/public/games-static/cactiquiz/assets/index-DvVfx9uO.js', 'utf8');

const s2 = 'position:[0,3.6,0],center:!0,zIndexRange:[100,0],children:(0,Q.jsx)(`div`,{className:`cactus-option-text`,style:{color:p,fontSize:`1.4rem`,background:`rgba(255,255,255,0.85)`,padding:`4px 12px`,borderRadius:`12px`,border:`2px solid `+p},children:n.word})';
const r2 = 'position:[0,3.15,0],center:!0,zIndexRange:[100,0],children:(0,Q.jsx)(`div`,{className:`cactus-option-text`,style:{color:p,fontSize:`1.1rem`,fontWeight:900,background:`rgba(255,255,255,0.9)`,padding:`2px 10px`,borderRadius:`10px`,border:`2px solid `+p},children:n.word})';

if (js.includes(s2)) {
    console.log("Found it!");
    const newJs = js.replace(s2, r2);
    fs.writeFileSync('g:/Ishuu/Admin project_company_ready/apps/web/public/games-static/cactiquiz/assets/index-DvVfx9uO.js', newJs);
} else {
    console.log("Not found.");
}
