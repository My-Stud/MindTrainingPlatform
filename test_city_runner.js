const fs = require('fs');
const js = fs.readFileSync('g:/Ishuu/Admin project_company_ready/apps/web/public/games-static/city-runner/assets/index-Dr6cWhj7.js', 'utf8');
const s = 'className:`score-badge`,children:[`⭐ `,o]';
const s2 = 'className:`score-badge`,style:{fontSize:`0.78rem`,padding:`3px 10px`},children:[`⭐ `,o]';
console.log('Desktop:', js.indexOf(s));
console.log('Mobile:', js.indexOf(s2));
