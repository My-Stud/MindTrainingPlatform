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
    console.log("Generating and downloading new HD images using Pollinations AI...");
    try {
        await downloadImage('A beautiful realistic acoustic guitar standing upright on a white background, high definition, vibrant', path.join(__dirname, 'public/images/word-2-picture/guitar.png'));
        console.log('Downloaded guitar.png');
        
        await downloadImage('A delicious colorful ice cream cone with sprinkles on a white background, high definition, vibrant', path.join(__dirname, 'public/images/word-2-picture/ice_cream.png'));
        console.log('Downloaded ice_cream.png');
        
        // Also fix the other broken ones from earlier just in case: kite, umbrella, watermelon, yacht
        await downloadImage('A colorful flying kite on a white background, high definition', path.join(__dirname, 'public/images/word-2-picture/kite.png'));
        console.log('Downloaded kite.png');

        await downloadImage('A red open umbrella on a white background, high definition', path.join(__dirname, 'public/images/word-2-picture/umbrella.png'));
        console.log('Downloaded umbrella.png');

        await downloadImage('A fresh slice of watermelon on a white background, high definition', path.join(__dirname, 'public/images/word-2-picture/watermelon.png'));
        console.log('Downloaded watermelon.png');

        await downloadImage('A luxury white yacht boat on a white background, high definition', path.join(__dirname, 'public/images/word-2-picture/yacht.png'));
        console.log('Downloaded yacht.png');

        console.log('All missing or broken images fixed successfully!');
    } catch (e) {
        console.error("Error downloading images:", e);
    }
}

run();
