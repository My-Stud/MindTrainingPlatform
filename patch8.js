const fs = require('fs');
const path = 'g:/Ishuu/Admin project_company_ready/apps/web/src/app/games/[slug]/page.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /<div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 w-full flex flex-col min-h-0"[^>]*>/g,
  '<div style={{ position: \'fixed\', top: \'80px\', left: 0, right: 0, height: viewportHeight > 0 ? `${viewportHeight - 80}px` : \'calc(100vh - 80px)\', zIndex: 40, display: \'flex\', flexDirection: \'column\' }}>'
);

fs.writeFileSync(path, content);
console.log('patched');
