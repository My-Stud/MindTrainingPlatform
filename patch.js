const fs = require('fs');
const path = 'g:/Ishuu/Admin project_company_ready/apps/web/src/app/games/[slug]/page.js';
let content = fs.readFileSync(path, 'utf8');
content = content.replace('className="w-full h-full border-none bg-white relative z-10"', 'className="w-full flex-1 min-h-0 border-none bg-white relative z-10"');
fs.writeFileSync(path, content);
console.log('patched');
