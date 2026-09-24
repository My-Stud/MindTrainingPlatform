'use server';

import path from 'path';
import Jimp from 'jimp';

export async function rotateImageAction(imageSrc, degrees) {
  try {
    // Sanitize and resolve the path
    const cleanPath = imageSrc.replace(/^\//, '');
    const fullPath = path.join(process.cwd(), 'public', cleanPath);
    
    // Read, rotate, and save the image
    const image = await Jimp.read(fullPath);
    
    // In CSS, rotate(90deg) is clockwise. In Jimp, rotate(90) is clockwise.
    // So we can pass the degrees directly.
    image.rotate(degrees);
    
    await image.writeAsync(fullPath);
    return { success: true };
  } catch (err) {
    console.error('Error rotating image:', err);
    return { success: false, error: err.message };
  }
}
