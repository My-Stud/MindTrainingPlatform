const fs = require('fs');
const https = require('https');
const path = require('path');

function downloadImage(prompt, dest) {
    return new Promise((resolve, reject) => {
        const url = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt) + '?width=500&height=500&nologo=true';
        
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close(resolve);
                });
            } else if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                https.get(response.headers.location, (res) => {
                    res.pipe(file);
                    file.on('finish', () => {
                        file.close(resolve);
                    });
                });
            } else {
                reject(new Error('Failed with status code ' + response.statusCode));
            }
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

async function run() {
    const items = [
        { name: 'pizza', prompt: 'A delicious hot slice of pizza, high quality 3d render, colorful children illustration, isolated on pure white background, perfectly centered' },
        { name: 'train', prompt: 'A colorful toy train, high quality 3d render, colorful children illustration, isolated on pure white background, perfectly centered' },
        { name: 'octopus', prompt: 'A cute purple octopus, high quality 3d render, colorful children illustration, isolated on pure white background, perfectly centered' },
        { name: 'rabbit', prompt: 'A cute fluffy white rabbit bunny, high quality 3d render, colorful children illustration, isolated on pure white background, perfectly centered' },
        { name: 'kangaroo', prompt: 'A cute brown kangaroo, high quality 3d render, colorful children illustration, isolated on pure white background, perfectly centered' },
        { name: 'nose', prompt: 'A human nose, high quality 3d render, colorful children illustration, isolated on pure white background, perfectly centered' },
        { name: 'snow', prompt: 'A beautiful blue glowing snowflake, high quality 3d render, colorful children illustration, isolated on pure white background, perfectly centered' },
        { name: 'island', prompt: 'A small tropical island with a palm tree, high quality 3d render, colorful children illustration, isolated on pure white background, perfectly centered' },
        { name: 'mouse', prompt: 'A cute little grey mouse, high quality 3d render, colorful children illustration, isolated on pure white background, perfectly centered' },
        { name: 'lemon', prompt: 'A bright yellow lemon fruit, high quality 3d render, colorful children illustration, isolated on pure white background, perfectly centered' },
        { name: 'jellyfish', prompt: 'A beautiful glowing jellyfish, high quality 3d render, colorful children illustration, isolated on pure white background, perfectly centered' },
    ];

    for (const item of items) {
        const dest = path.join(__dirname, `public/images/word-2-picture/${item.name}.png`);
        console.log(`Downloading ${item.name}.png...`);
        try {
            await downloadImage(item.prompt, dest);
            console.log(`Downloaded ${item.name}.png`);
        } catch (e) {
            console.error(`Error downloading ${item.name}.png:`, e);
        }
    }
}

run();
