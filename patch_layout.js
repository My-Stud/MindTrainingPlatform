const fs = require('fs');
const path = 'g:/Ishuu/Admin project_company_ready/apps/web/src/components/LayoutShell.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'const hideChrome = isAdmin || isEmbed;',
  'const hideChrome = isAdmin || isEmbed;\n  const isGame = pathname?.startsWith("/games/") && pathname !== "/games";'
);

content = content.replace(
  '<main className={hideChrome ? "flex-grow" : "pt-20 flex-grow"}>',
  '<main className={hideChrome ? "flex-grow h-screen overflow-hidden" : isGame ? "pt-20 flex-grow h-[100dvh] overflow-hidden" : "pt-20 flex-grow"}>'
);

content = content.replace(
  '{!hideChrome && <Footer />}',
  '{!hideChrome && !isGame && <Footer />}'
);

fs.writeFileSync(path, content);
console.log('patched LayoutShell');
