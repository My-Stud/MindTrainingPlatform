const Jimp = require('jimp');

async function processImage(file) {
  try {
    const image = await Jimp.read(file);
    console.log(`Loaded ${file}: ${image.bitmap.width}x${image.bitmap.height}`);
    
    // Rotate 90 degrees clockwise
    image.rotate(-90); // Note: In Jimp, rotate(deg) actually uses CSS convention? Or standard? We'll test with -90 (some docs say -90 is clockwise) wait, let's just use CSS!
    
    // Actually, CSS is guaranteed. Let's just output the rotated file.
    await image.writeAsync(file.replace('.png', '_jimp.png'));
    console.log(`Saved jimp version of ${file}`);
  } catch (err) {
    console.error("Error processing " + file, err);
  }
}

processImage('public/images/achievements/c19.png');
processImage('public/images/achievements/c20.png');
