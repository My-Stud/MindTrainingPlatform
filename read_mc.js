const fs = require('fs');
const js = fs.readFileSync('g:/Ishuu/Admin project_company_ready/apps/web/public/games-static/tactical-sniper/assets/index-CEBJASO8.js', 'utf8');
const idx = js.indexOf('className:"mobile-controls"');
console.log(js.substring(idx - 200, idx + 400));
