const https = require('https');
const fs = require('fs');
const path = require('path');

const items = {
    // The ones I broke earlier with loremflickr:
    'Acoustic guitar': 'guitar-new.png',
    'Ice cream': 'ice_cream.png',
    'Flower': 'flower.png',
    'House': 'house.png',
    'Elephant': 'elephant.png',
    'Cloud': 'cloud.png',
    'Car': 'car.png',
    'Lion': 'lion.png',
    'Tiger': 'tiger.png',
    'Tree': 'tree.png',
    'Watermelon': 'watermelon-new.png',
    
    // The new ones requested by user:
    'Pizza': 'pizza.png',
    'Train': 'train.png',
    'Octopus': 'octopus.png',
    'Rabbit': 'rabbit.png',
    'Kangaroo': 'kangaroo.png',
    'Human nose': 'nose.png',
    'Snow': 'snow.png',
    'Island': 'island.png',
    'Mouse': 'mouse.png',
    'Lemon': 'lemon.png',
    'Jellyfish': 'jellyfish.png'
};

async function fetchWikiImage(title, filename) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(title)}`;
    
    return new Promise((resolve, reject) => {
        const headers = { 'User-Agent': 'MindTrainingAppBot/1.0 (subrat@example.com) Node.js/18' };
        https.get(url, { headers }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const pages = json.query.pages;
                    const pageId = Object.keys(pages)[0];
                    if (pages[pageId] && pages[pageId].original && pages[pageId].original.source) {
                        const imgUrl = pages[pageId].original.source;
                        downloadFile(imgUrl, filename).then(resolve).catch(reject);
                    } else {
                        console.log(`No image found for ${title}`);
                        resolve();
                    }
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
}

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const destPath = path.join(__dirname, 'public/images/word-2-picture', dest);
        const file = fs.createWriteStream(destPath);
        const headers = { 'User-Agent': 'MindTrainingAppBot/1.0 (subrat@example.com) Node.js/18' };
        
        https.get(url, { headers }, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => file.close(resolve));
            } else if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                 https.get(response.headers.location, { headers }, (res) => {
                     res.pipe(file);
                     file.on('finish', () => file.close(resolve));
                 });
            } else {
                reject(new Error(`Failed with status ${response.statusCode}`));
            }
        }).on('error', err => {
            fs.unlink(destPath, () => reject(err));
        });
    });
}

async function main() {
    console.log("Fetching images from Wikipedia...");
    for (const [title, filename] of Object.entries(items)) {
        console.log(`Fetching ${title}...`);
        await fetchWikiImage(title, filename);
        await delay(1500);
    }
    console.log("Done fetching Wikipedia images!");
}

main();
