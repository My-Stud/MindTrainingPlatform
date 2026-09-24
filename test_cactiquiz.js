const fs = require('fs');
const js = fs.readFileSync('g:/Ishuu/Admin project_company_ready/apps/web/public/games-static/cactiquiz/assets/index-DvVfx9uO.js', 'utf8');

const s1 = 'function Zj({onRestart:e}){let{score:t,gameState:n,togglePause:r}=Xb();return(0,Q.jsxs)(`div`,{className:`top-hud`,children:[(0,Q.jsxs)(`div`,{className:`hud-left`,children:[(0,Q.jsx)(`button`,{className:`icon-btn`,onClick:r,children:n===`paused`?(0,Q.jsx)(Yj,{size:24,strokeWidth:3}):(0,Q.jsx)(Jj,{size:24,strokeWidth:3})}),(0,Q.jsx)(`button`,{className:`icon-btn`,onClick:e,children:(0,Q.jsx)(Xj,{size:24,strokeWidth:3})})]}),(0,Q.jsx)(`div`,{className:`hud-right`,children:(0,Q.jsxs)(`div`,{className:`score-badge`,children:[(0,Q.jsx)(`div`,{className:`coin-icon`,children:`★`}),t]})})]})}';
const r1 = 'function Zj({onRestart:e}){let{score:t,gameState:n,togglePause:r,currentQuestionIndex:qIdx,questions:qArr}=Xb();return(0,Q.jsxs)(`div`,{className:`top-hud`,children:[(0,Q.jsxs)(`div`,{className:`hud-left`,children:[(0,Q.jsx)(`button`,{className:`icon-btn`,onClick:r,children:n===`paused`?(0,Q.jsx)(Yj,{size:24,strokeWidth:3}):(0,Q.jsx)(Jj,{size:24,strokeWidth:3})}),(0,Q.jsx)(`button`,{className:`icon-btn`,onClick:e,children:(0,Q.jsx)(Xj,{size:24,strokeWidth:3})})]}),(0,Q.jsx)(`div`,{className:`hud-right`,children:(0,Q.jsxs)(`div`,{className:`score-badge`,style:{fontSize:`0.9rem`,padding:`6px 12px`},children:[`Q: `,qIdx+1,`/`,qArr.length,` | `,(0,Q.jsx)(`div`,{className:`coin-icon`,children:`★`}),t]})})]})}';

const s2 = 'position:[0,3,0],center:!0,zIndexRange:[100,0],children:(0,Q.jsx)(`div`,{className:`cactus-option-text`,style:{color:p},children:n.word})';
const r2 = 'position:[0,3.6,0],center:!0,zIndexRange:[100,0],children:(0,Q.jsx)(`div`,{className:`cactus-option-text`,style:{color:p,fontSize:`1.4rem`,background:`rgba(255,255,255,0.85)`,padding:`4px 12px`,borderRadius:`12px`,border:`2px solid `+p},children:n.word})';

let newJs = js;
if (newJs.includes(s1)) {
    newJs = newJs.replace(s1, r1);
    console.log('Replaced Zj (HUD)');
} else {
    console.log('Zj NOT FOUND');
}

if (newJs.includes(s2)) {
    newJs = newJs.replace(s2, r2);
    console.log('Replaced text bubble');
} else {
    console.log('Text bubble NOT FOUND');
}

fs.writeFileSync('g:/Ishuu/Admin project_company_ready/apps/web/public/games-static/cactiquiz/assets/index-DvVfx9uO.js', newJs);
