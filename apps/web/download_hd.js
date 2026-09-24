const fs = require('fs');
const https = require('https');
const path = require('path');

function downloadImage(prompt, dest) {
    return new Promise((resolve, reject) => {
        // We use a high definition real photo prompt format
        const fullPrompt = `A high definition realistic photo of ${prompt}, high quality, real life photography, white background`;
        const url = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(fullPrompt) + '?width=500&height=500&nologo=true';
        
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close(resolve);
                });
            } else if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                const redirectUrl = new URL(response.headers.location, url).href;
                https.get(redirectUrl, (res) => {
                    res.pipe(file);
                    file.on('finish', () => {
                        file.close(resolve);
                    });
                }).on('error', err => {
                    fs.unlink(dest, () => reject(err));
                });
            } else {
                reject(new Error('Failed with status code ' + response.statusCode));
            }
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

const items = [
    { word: "an apple", file: "apple.png" },
    { word: "an ant", file: "ant-new.png" },
    { word: "a book", file: "book.png" },
    { word: "a ball", file: "ball-new.png" },
    { word: "a cat", file: "cat.png" },
    { word: "a car", file: "car.png" },
    { word: "a cloud in the sky", file: "cloud.png" },
    { word: "a dog", file: "dog.png" },
    // duck-new and xray-new were just updated by me, but let's leave them or re-download
    { word: "an elephant", file: "elephant.png" },
    { word: "an eagle", file: "eagle.png" },
    { word: "a flower", file: "flower.png" },
    { word: "a frog", file: "frog.png" },
    { word: "an acoustic guitar", file: "guitar-new.png" },
    { word: "a giraffe", file: "giraffe.png" },
    { word: "a house", file: "house.png" },
    { word: "a hat", file: "hat.png" },
    { word: "an ice cream cone", file: "ice_cream.png" },
    { word: "an igloo", file: "igloo.png" },
    { word: "a pair of blue jeans", file: "jeans.png" },
    // SKIPPING JUICE
    { word: "a shiny key", file: "key-new.png" },
    { word: "a flying kite", file: "kite.png" },
    { word: "a lion", file: "lion.png" },
    { word: "a green leaf", file: "leaf.png" },
    { word: "the full moon", file: "moon.png" },
    { word: "a monkey", file: "monkey.png" },
    { word: "a notebook", file: "notebook-new.png" },
    { word: "a bird nest", file: "nest.png" },
    { word: "an owl", file: "owl-new.png" },
    { word: "an orange fruit", file: "orange.png" },
    { word: "a penguin", file: "penguin.png" },
    { word: "a pig", file: "pig.png" },
    { word: "a queen's crown", file: "queen-new.png" },
    { word: "a colorful quilt", file: "quilt.png" },
    { word: "rain falling", file: "rain.png" },
    { word: "a space rocket", file: "rocket.png" },
    { word: "the bright sun", file: "sun.png" },
    { word: "a glowing star", file: "star.png" },
    { word: "snow falling", file: "snow.png" },
    { word: "a green tree", file: "tree.png" },
    { word: "a tiger", file: "tiger.png" },
    { word: "an open umbrella", file: "umbrella-new.png" },
    { word: "a white unicorn toy", file: "unicorn.png" },
    { word: "an erupting volcano", file: "volcano.png" },
    { word: "a flower vase", file: "vase.png" },
    { word: "a slice of watermelon", file: "watermelon-new.png" },
    { word: "a whale", file: "whale.png" },
    { word: "a colorful xylophone", file: "xylophone.png" },
    { word: "a yoyo", file: "yoyo-new.png" },
    { word: "a white yacht", file: "yacht.png" },
    { word: "a zebra", file: "zebra-new.png" },
    { word: "a zoo entrance", file: "zoo.png" }
];

async function run() {
    console.log("Generating HD images...");
    for (const item of items) {
        if (item.file === 'juice.png') continue; // explicitly skip juice just in case
        const destPath = path.join(__dirname, 'public/images/word-2-picture', item.file);
        try {
            console.log(`Downloading ${item.file}...`);
            await downloadImage(item.word, destPath);
        } catch (e) {
            console.error(`Error downloading ${item.file}:`, e);
        }
    }
    console.log("All done!");
}

run();
