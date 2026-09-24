const fs = require('fs');
const js = fs.readFileSync('g:/Ishuu/Admin project_company_ready/apps/web/public/games-static/tactical-sniper/assets/index-CEBJASO8.js', 'utf8');
const idx = js.indexOf('className:"move-group"');
if (idx !== -1) {
    console.log(js.substring(idx, idx + 500));
}
