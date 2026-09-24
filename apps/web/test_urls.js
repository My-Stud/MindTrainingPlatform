const https = require('https');

async function checkURL(url) {
    return new Promise((resolve) => {
        https.request(url, { method: 'HEAD' }, (res) => {
            resolve(res.statusCode === 200);
        }).end();
    });
}

async function run() {
    const urls = [
        'https://upload.wikimedia.org/wikipedia/commons/a/a2/Tyrannosaurus_rex_model.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/4/4e/Christmas_tree_in_the_snow.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/0/07/Toy_dinosaur.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/e/e0/Flying_saucer_model.jpg'
    ];
    for (const u of urls) {
        console.log(u, await checkURL(u));
    }
}
run();
