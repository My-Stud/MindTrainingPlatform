const https = require('https');

async function searchCommons(query) {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=10&prop=imageinfo&iiprop=url&format=json`;
    return new Promise((resolve) => {
        const headers = { 'User-Agent': 'MindTrainingAppBot/1.0' };
        https.get(url, { headers }, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const pages = json?.query?.pages;
                    if (pages) {
                        for (const page of Object.values(pages)) {
                            if (page.imageinfo && page.imageinfo[0] && page.imageinfo[0].url) {
                                console.log(page.imageinfo[0].url);
                            }
                        }
                    }
                } catch(e) {}
                resolve();
            });
        });
    });
}

async function run() {
    console.log("--- Octopus swimming ---");
    await searchCommons('octopus swimming');
    console.log("--- Octopus water ---");
    await searchCommons('octopus water');
}
run();
