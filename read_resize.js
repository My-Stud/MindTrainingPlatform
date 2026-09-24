const fs = require('fs');
const js = fs.readFileSync('g:/Ishuu/Admin project_company_ready/apps/web/public/games-static/tactical-sniper/assets/index-CEBJASO8.js', 'utf8');
const idx = js.lastIndexOf('window.addEventListener("resize"');
console.log(js.substring(idx - 300, idx + 300));
