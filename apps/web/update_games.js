const fs = require('fs');
const path = require('path');
const gamesDir = path.join(__dirname, 'src/app/games');
const folders = fs.readdirSync(gamesDir);
let count = 0;
for (const folder of folders) {
    const pagePath = path.join(gamesDir, folder, 'page.js');
    if (fs.existsSync(pagePath)) {
        let content = fs.readFileSync(pagePath, 'utf8');
        if (content.includes('src="/games-static/')) {
            content = content.replace(/src="\/games-static\//g, 'src="https://viebrain-games.b-cdn.net/');
            fs.writeFileSync(pagePath, content, 'utf8');
            count++;
        }
    }
}
console.log('Updated ' + count + ' game pages.');
