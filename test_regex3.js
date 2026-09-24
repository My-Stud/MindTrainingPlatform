const fs = require('fs');
const js = fs.readFileSync('g:/Ishuu/Admin project_company_ready/apps/web/public/games-static/institute-orbit/assets/index-UpeUkVsP.js', 'utf8');

const match = js.match(/.{0,80}\|\|"Question"\}\`\).{0,50}/g);
if (match) console.log(match[0]);
