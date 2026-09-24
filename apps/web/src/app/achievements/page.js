import fs from 'fs';
import path from 'path';
import AchievementsClient from './AchievementsClient';

export const metadata = {
  title: 'Achievements | VieBrain',
  description: 'Celebrating a legacy of excellence. Explore our curated collection of certificates and awards.',
};

export default function AchievementsPage() {
  const directoryPath = path.join(process.cwd(), 'public/images/achievements');
  
  let achievementFiles = [];
  try {
    if (fs.existsSync(directoryPath)) {
      const files = fs.readdirSync(directoryPath);
      achievementFiles = files.filter(file => /\.(png|jpe?g|gif|svg|webp|jfif)$/i.test(file));
      
      // Sort numerically if files have numbers in their names (e.g., c1.png, c2.png, c10.png)
      achievementFiles.sort((a, b) => {
        const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
        const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
        return numA - numB;
      });
    }
  } catch (error) {
    console.error("Error reading achievements directory:", error);
  }

  const achievements = achievementFiles.map((filename, i) => ({
    id: i + 1,
    src: `/images/achievements/${filename}`,
    alt: `Achievement Certificate ${i + 1}`
  }));

  return <AchievementsClient achievements={achievements} />;
}
