const fs = require('fs');
const https = require('https');
const path = require('path');

function downloadImage(keyword, dest) {
    return new Promise((resolve, reject) => {
        const url = `https://loremflickr.com/500/500/${encodeURIComponent(keyword)}`;
        const file = fs.createWriteStream(dest);
        
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => file.close(resolve));
            } else if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                 const redirectUrl = new URL(response.headers.location, url).href;
                 https.get(redirectUrl, (res) => {
                     res.pipe(file);
                     file.on('finish', () => file.close(resolve));
                 }).on('error', err => {
                     fs.unlink(dest, () => reject(err));
                 });
            } else {
                reject(new Error(`Failed with status code ${response.statusCode}`));
            }
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

async function run() {
    const items = [
        { name: 'pizza', keyword: 'pizza' },
        { name: 'train', keyword: 'train' },
        { name: 'octopus', keyword: 'octopus' },
        { name: 'rabbit', keyword: 'rabbit' },
        { name: 'kangaroo', keyword: 'kangaroo' },
        { name: 'nose', keyword: 'nose' },
        { name: 'snow', keyword: 'snow' },
        { name: 'island', keyword: 'island' },
        { name: 'mouse', keyword: 'mouse' },
        { name: 'lemon', keyword: 'lemon' },
        { name: 'jellyfish', keyword: 'jellyfish' }
    ];

    for (const item of items) {
        const dest = path.join(__dirname, `public/images/word-2-picture/${item.name}.png`);
        console.log(`Downloading ${item.name}.png...`);
        try {
            await downloadImage(item.keyword, dest);
            console.log(`Downloaded ${item.name}.png`);
        } catch (e) {
            console.error(`Error downloading ${item.name}.png:`, e);
        }
    }
}

run();
