const fs = require('fs');

const path = 'g:/Ishuu/Admin project_company_ready/apps/web/src/components/Navigation.js';
let content = fs.readFileSync(path, 'utf8');

// Replace flex-1 flex justify-end sm:justify-center ...
content = content.replace('className="flex-1 flex justify-end sm:justify-center pointer-events-none overflow-hidden"', 'className="flex-1 flex justify-center pointer-events-none overflow-hidden"');
content = content.replace('className="flex items-center justify-end sm:justify-center w-full sm:w-auto gap-1 sm:gap-6 pointer-events-auto px-1"', 'className="flex items-center justify-center w-full sm:w-auto gap-1 sm:gap-6 pointer-events-auto px-1"');

fs.writeFileSync(path, content);
console.log('Patched');
