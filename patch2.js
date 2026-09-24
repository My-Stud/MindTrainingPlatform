const fs = require('fs');
const path = 'g:/Ishuu/Admin project_company_ready/apps/web/src/app/games/[slug]/page.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove marginTop: 80px
content = content.replace('style={{ height: "calc(100dvh - 80px)", marginTop: "80px" }}', 'style={{ height: "calc(100dvh - 80px)" }}');
// Also fallback if they have single quotes or different spacing
content = content.replace(/marginTop:\s*['"]80px['"]/g, '');

// 2. Fix iframe className to fill wrapper
content = content.replace('className="w-full flex-1 min-h-0 border-none bg-white relative z-10"', 'className="absolute inset-0 w-full h-full border-none bg-white z-10"');
// Also catch the old one just in case
content = content.replace('className="w-full h-full border-none bg-white relative z-10"', 'className="absolute inset-0 w-full h-full border-none bg-white z-10"');

fs.writeFileSync(path, content);
console.log('patched');
