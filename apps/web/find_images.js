const https = require('https');

async function searchCommons(query) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=10&prop=pageimages&format=json&piprop=original`;
    return new Promise((resolve) => {
        const headers = { 'User-Agent': 'MindTrainingAppBot/1.0' };
        https.get(url, { headers }, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                const results = [];
                try {
                    const json = JSON.parse(data);
                    const pages = json?.query?.pages;
                    if (pages) {
                        for (const page of Object.values(pages)) {
                            if (page.original && page.original.source && !page.original.source.endsWith('.svg')) {
                                results.push(page.original.source);
                            }
                        }
                    }
                } catch(e) {}
                resolve(results);
            });
        });
    });
}

async function run() {
    const queries = [
        'Tyrannosaurus rex life restoration',
        'Triceratops life restoration',
        'Zombie costume',
        'Decorated Christmas tree indoors',
        'Christmas tree isolated',
        'Flying saucer model',
        'UFO rendering'
    ];
    for (const q of queries) {
        console.log(`--- ${q} ---`);
        const urls = await searchCommons(q);
        urls.forEach(u => console.log(u));
    }
}
run();
