const fs = require('fs');

const layoutPath = 'g:/Ishuu/Admin project_company_ready/apps/web/src/components/LayoutShell.js';
let content = fs.readFileSync(layoutPath, 'utf8');

const regex1 = /<main className=\{hideChrome \? "[^"]+" : isGame \? "[^"]+" : "[^"]+"\}\>/;
const regex2 = /<main className=\{hideChrome \? "[^"]+" : "pt-20 flex-grow"\}\>/;

const replacement = '<main className={hideChrome ? "flex-grow flex flex-col h-screen overflow-hidden" : isGame ? "fixed inset-0 pt-20 flex flex-col overflow-hidden bg-background" : "pt-20 flex-grow"}>';

if (regex1.test(content)) {
    content = content.replace(regex1, replacement);
    console.log("Matched regex1");
} else if (regex2.test(content)) {
    content = content.replace(regex2, replacement);
    console.log("Matched regex2");
} else {
    console.log("Matched NEITHER!");
}
