const fs = require('fs');
const https = require('https');
const path = require('path');

const imgDir = path.join(__dirname, 'public/images/word-2-picture');

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
    console.log("Checking for 0-byte images to fix...");
    const files = fs.readdirSync(imgDir);
    let count = 0;
    
    for (const file of files) {
        if (!file.endsWith('.png')) continue;
        const filePath = path.join(imgDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.size === 0) {
            let keyword = file.replace('-new.png', '').replace('.png', '').replace('_', '');
            if (keyword === 'xylophone') keyword = 'music';
            if (keyword === 'quilt') keyword = 'blanket';
            if (keyword === 'yacht') keyword = 'boat';
            if (keyword === 'volcano') keyword = 'mountain';
            if (keyword === 'umbrella') keyword = 'rain';
            if (keyword === 'unicorn') keyword = 'horse';
            
            console.log(`Fixing ${file} with keyword ${keyword}...`);
            try {
                await downloadImage(keyword, filePath);
                count++;
            } catch (e) {
                console.error(`Failed to download ${file}:`, e.message);
                // Fallback
                try {
                    await downloadImage('nature', filePath);
                } catch(err){}
            }
        }
    }
    console.log(`Fixed ${count} missing/empty images.`);
}

run();
