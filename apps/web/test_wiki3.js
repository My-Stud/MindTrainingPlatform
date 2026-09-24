const https = require('https');

async function testSearch(query) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=5&prop=pageimages&format=json&piprop=original`;
    return new Promise((resolve) => {
        const headers = { 'User-Agent': 'MindTrainingAppBot/1.0' };
        https.get(url, { headers }, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                const json = JSON.parse(data);
                const pages = json?.query?.pages;
                if (pages) {
                    const sortedPages = Object.values(pages).sort((a, b) => (a.index || 0) - (b.index || 0));
                    for (const page of sortedPages) {
                        if (page.original && page.original.source && !page.original.source.endsWith('.svg')) {
                            resolve(page.original.source);
                            return;
                        }
                    }
                }
                resolve('No image');
            });
        });
    });
}

async function run() {
    const queries = ['Snowman', 'Snowball', 'Winter landscape', 'Dumbo octopus', 'Octopus in water', 'Common octopus swimming', 'Octopus vulgaris', 'Octopus blue water'];
    for (const q of queries) {
        console.log(q, '->', await testSearch(q));
    }
}
run();
