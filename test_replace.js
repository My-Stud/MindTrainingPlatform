const fs = require('fs');

const content = `<div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 w-full flex flex-col min-h-0" style={{ height: viewportHeight > 0 ? \`\${viewportHeight - 80}px\` : '100vh' }}>
        <div className="flex items-center">`;

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8')) {
        lines[i] = '<div style={{ position: \'fixed\', top: \'80px\', left: 0, right: 0, height: viewportHeight > 0 ? `${viewportHeight - 80}px` : \'calc(100vh - 80px)\', zIndex: 40, display: \'flex\', flexDirection: \'column\' }}>';
        break;
    }
}
console.log(lines.join('\n'));
