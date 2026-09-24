import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    
    if (!q) {
        return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    // Map generic words to more specific terms for better Wikipedia images
    const searchOverrides = {
        'House': 'Cottage',
        'Ice Cream': 'Ice cream cone',
        'Ball': 'Soccer ball',
        'Juice': 'Orange juice glass',
        'Duck': 'Mallard',
        'Queen': 'Queen Elizabeth II',
        'Nest': 'Bird nest',
        'Key': 'Key (lock)',
        'Tree': 'Deciduous',
        'Rain': 'Falling rain',
        'Sun': 'Sunrise',
        'Yo-Yo': 'Yo-yo toy',
        'X-Ray': 'Skeleton',
        'Car': 'Sports car',
        'Hat': 'Cowboy hat',
        'Igloo': 'Ice hotel',
        'Giraffe': 'Reticulated giraffe',
        'Kite': 'Diamond kite',
        'Eagle': 'Bald eagle',
        'Frog': 'Green frog',
        'Whale': 'Killer whale',
        'Pig': 'Large White pig',
        'Star': 'Star (polygon)',
        'Cloud': 'Cumulus',
        'Zoo': 'Zoo entrance',
        'Yacht': 'Motor yacht',
        'Horse': 'White horse',
        'Dolphin': 'Common dolphin',
        'Bear': 'Grizzly bear',
        'Fish': 'Goldfish',
        'Eye': 'Iris (anatomy)',
        'Ghost': 'Sheet ghost',
        'Nose': 'Nose profile',
        'Snow': 'Snowman',
        'Lemon': 'Meyer lemon',
        'Island': 'Desert island',
        'Octopus': 'Common octopus swimming',
        'Mouse': 'House mouse',
        'Alien': 'Extraterrestrial in fiction',
        'Zombie': 'Zombie walk',
        'Dinosaur': 'Dinosaur model',
        'Egg': 'Fried egg',
        'Xmas Tree': 'Rockefeller Center Christmas Tree',
        'UFO': 'UFO model'
    };
    
    const searchQuery = searchOverrides[q] || q;

    try {
        // Query Wikipedia Search API to find an article matching the term and get its original image
        const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(searchQuery)}&gsrlimit=5&prop=pageimages&format=json&piprop=original`;
        const headers = { 'User-Agent': 'MindTrainingAppBot/1.0 (subrat@example.com) Node.js/18' };
        
        const response = await fetch(url, { headers });
        const json = await response.json();
        const pages = json?.query?.pages;
        
        if (pages) {
            // Sort by index to get the best search result first
            const sortedPages = Object.values(pages).sort((a, b) => (a.index || 0) - (b.index || 0));
            
            for (const page of sortedPages) {
                if (page.original && page.original.source) {
                    // Ignore non-image formats like svg, webm, ogg. Prefer jpg/png/webp
                    const src = page.original.source.toLowerCase();
                    if (src.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                        const res = NextResponse.redirect(page.original.source);
                        res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
                        return res;
                    }
                }
            }
            
            // If all had SVGs (or we missed the first filter), just return the first image format we find
            for (const page of sortedPages) {
                if (page.original && page.original.source) {
                    const src = page.original.source.toLowerCase();
                    if (src.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
                        const res = NextResponse.redirect(page.original.source);
                        res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
                        return res;
                    }
                }
            }
        }
        
        // Fallback to picsum if wikipedia totally fails
        const res = NextResponse.redirect(`https://picsum.photos/seed/${encodeURIComponent(q)}/500/500`);
        res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        return res;
        
    } catch (error) {
        console.error('Error fetching image:', error);
        const res = NextResponse.redirect(`https://loremflickr.com/500/500/${encodeURIComponent(q)}`);
        res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        return res;
    }
}
