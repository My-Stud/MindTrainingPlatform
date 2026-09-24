const fs = require('fs');

const content = `<div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 w-full flex flex-col min-h-0" style={{ height: viewportHeight > 0 ? \`\${viewportHeight - 80}px\` : '100vh' }}>
        <div className="flex items-center">`;

const regex = /<div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8[\s\S]*?>/g;
console.log(content.replace(regex, 'MATCHED'));
