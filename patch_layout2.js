const fs = require('fs');
const path = 'g:/Ishuu/Admin project_company_ready/apps/web/src/components/LayoutShell.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  '<main className={hideChrome ? "flex-grow flex flex-col h-screen overflow-hidden" : isGame ? "pt-20 flex-grow flex flex-col h-[100dvh] overflow-hidden" : "pt-20 flex-grow flex flex-col"}>',
  '<main className={hideChrome ? "flex-grow flex flex-col h-screen overflow-hidden" : isGame ? "fixed inset-0 pt-20 flex flex-col overflow-hidden bg-background" : "pt-20 flex-grow"}>'
);
// Also catch the previous one just in case
content = content.replace(
  '<main className={hideChrome ? "flex-grow h-screen overflow-hidden" : isGame ? "pt-20 flex-grow h-[100dvh] overflow-hidden" : "pt-20 flex-grow"}>',
  '<main className={hideChrome ? "flex-grow flex flex-col h-screen overflow-hidden" : isGame ? "fixed inset-0 pt-20 flex flex-col overflow-hidden bg-background" : "pt-20 flex-grow"}>'
);

fs.writeFileSync(path, content);
console.log('patched LayoutShell with fixed inset-0');
