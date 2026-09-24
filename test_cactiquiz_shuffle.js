const fs = require('fs');
const js = fs.readFileSync('g:/Ishuu/Admin project_company_ready/apps/web/public/games-static/cactiquiz/assets/index-DvVfx9uO.js', 'utf8');

const s1 = 'let t=e.options.map(t=>({word:t,isCorrect:t===e.answer,id:Math.random()}));return{definition:e.question,mnemonic:e.hint||``,options:t}';
const r1 = 'let t=[...e.options].sort(()=>Math.random()-0.5).map(t=>({word:t,isCorrect:t===e.answer,id:Math.random()}));return{definition:e.question,mnemonic:e.hint||``,options:t}';

if (js.includes(s1)) {
    console.log("Found it!");
    const newJs = js.replace(s1, r1);
    fs.writeFileSync('g:/Ishuu/Admin project_company_ready/apps/web/public/games-static/cactiquiz/assets/index-DvVfx9uO.js', newJs);
    console.log("Replaced!");
} else {
    console.log("Not found.");
}
