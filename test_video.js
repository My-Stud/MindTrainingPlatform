const fs = require('fs');
const path = 'g:/Ishuu/Admin project_company_ready/apps/web/src/app/media-center/videos/page.js';

let code = fs.readFileSync(path, 'utf8');

const oldImg = `<img 
                  src={video.poster} 
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />`;

const newVid = `<video 
                  src={video.videoUrl + "#t=0.5"} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                  preload="metadata"
                  muted
                  playsInline
                />`;

if (code.includes(oldImg)) {
    code = code.replace(oldImg, newVid);
    fs.writeFileSync(path, code);
    console.log('Replaced successfully');
} else {
    console.log('Not found');
}
