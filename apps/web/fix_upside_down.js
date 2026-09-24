const Jimp = require('jimp');
const path = require('path');

const files = ['c17.png', 'c18.png', 'c19.png'];

async function rotate180() {
  for (const file of files) {
    const fullPath = path.join('public/images/achievements', file);
    try {
      const image = await Jimp.read(fullPath);
      console.log(`Loaded ${file}: ${image.bitmap.width}x${image.bitmap.height}`);
      
      // The images are currently upside down (180 degrees).
      // Rotating by 180 degrees will make them upright.
      image.rotate(180);
      
      await image.writeAsync(fullPath);
      console.log(`Successfully rotated ${file} by 180 degrees`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
}

rotate180();
