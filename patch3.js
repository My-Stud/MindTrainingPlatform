const fs = require('fs');
const path = 'g:/Ishuu/Admin project_company_ready/apps/web/src/app/games/[slug]/page.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 flex flex-col" style={{ height: "calc(100dvh - 80px)" }}',
  'className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 w-full flex-1 flex flex-col min-h-0"'
);

fs.writeFileSync(path, content);
console.log('patched');
