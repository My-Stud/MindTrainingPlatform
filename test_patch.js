const fs = require('fs');
const js = fs.readFileSync('g:/Ishuu/Admin project_company_ready/apps/web/public/games-static/institute-orbit/assets/index-UpeUkVsP.js', 'utf8');

const s1 = '(`${oe+1}. ${J.question.label||"Question"}`)';
const r1 = '(`${oe+1}/${Ge.length} ${J.question.label||"Question"}`)';

let newJs = js;
if (newJs.includes(s1)) {
    newJs = newJs.replace(s1, r1);
    console.log('Replaced s1');
} else {
    console.log('s1 not found');
}

fs.writeFileSync('g:/Ishuu/Admin project_company_ready/apps/web/public/games-static/institute-orbit/assets/index-UpeUkVsP.js', newJs);
