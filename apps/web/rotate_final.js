const Jimp = require('jimp');
const path = require('path');

const files = ['c17.png', 'c18.png', 'c19.png'];

async function rotateImages() {
  for (const file of files) {
    const fullPath = path.join('public/images/achievements', file);
    try {
      const image = await Jimp.read(fullPath);
      console.log(`Loaded ${file}: ${image.bitmap.width}x${image.bitmap.height}`);
      
      // The user explicitly stated: "move once towards left in anti-clock-wise direction"
      // Jimp.rotate(deg) rotates clockwise. -90 rotates anti-clockwise.
      image.rotate(-90);
      
      // Save it back, overwriting the original file
      await image.writeAsync(fullPath);
      console.log(`Successfully rotated and saved ${file}`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
}

rotateImages();
