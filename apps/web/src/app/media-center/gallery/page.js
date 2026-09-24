import fs from 'fs';
import path from 'path';

function getAllImages(dirPath, publicDir, arrayOfImages) {
  try {
    const files = fs.readdirSync(dirPath);

    arrayOfImages = arrayOfImages || [];

    files.forEach(function(file) {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        arrayOfImages = getAllImages(fullPath, publicDir, arrayOfImages);
      } else {
        if (file.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          const relPath = path.relative(publicDir, fullPath);
          const urlPath = '/' + relPath.replace(/\\/g, '/');
          arrayOfImages.push(urlPath);
        }
      }
    });

    return arrayOfImages;
  } catch (error) {
    console.error("Error reading directory:", error);
    return arrayOfImages || [];
  }
}

export default function GalleryPage() {
  const publicDir = path.join(process.cwd(), 'public');
  
  // Specific professional directories to include in the gallery
  const targetDirs = [
    path.join(publicDir, 'images', 'achievements'),
    path.join(publicDir, 'images', 'banners')
  ];

  let allImages = [];
  
  targetDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const dirImages = getAllImages(dir, publicDir, []);
      allImages = [...allImages, ...dirImages];
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-4">Media Gallery</h1>
          <p className="text-slate-600 font-medium max-w-2xl mx-auto">
            A comprehensive visual collection of our platform's assets, programs, and milestones.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allImages.map((src, index) => (
            <div key={index} className="group relative rounded-2xl overflow-hidden bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 aspect-square hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)] hover:-translate-y-2 transition-all duration-500">
              {/* Image */}
              <img 
                src={src} 
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-emerald-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5">
                <p className="text-white text-sm font-bold truncate tracking-wide mb-1">
                  {src.split('/').pop().replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, "")}
                </p>
                <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                  View Full Image
                </p>
              </div>
            </div>
          ))}
          
          {allImages.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-500 font-medium">
              No images found in the gallery yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
