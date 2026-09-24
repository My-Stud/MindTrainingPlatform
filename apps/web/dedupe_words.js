const fs = require('fs');

const targetFile = 'src/app/games/word-2-picture/page.js';
let content = fs.readFileSync(targetFile, 'utf8');

const startIdx = content.indexOf('const alphabetData = {');
const endIdx = content.indexOf('};', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    const oldBlock = content.substring(startIdx, endIdx + 2);
    
    let newBlock = 'const alphabetData = {\n';
    
    const lines = oldBlock.split('\n');
    for (let i = 1; i < lines.length - 1; i++) {
        const line = lines[i];
        const match = line.match(/^\s*([A-Z]):\s*\[(.*)\]\s*,?$/);
        if (match) {
            const letter = match[1];
            const arrayContent = match[2].trim();
            
            // We need to parse the objects in the array.
            // A simple regex approach to find all `{ text: "Word", ... }` objects
            const objectRegex = /{\s*text:\s*"([^"]+)"(?:,\s*emoji:\s*"[^"]+")?(?:,\s*src:\s*"[^"]+")?\s*}/g;
            const textToObj = new Map(); // Use Map to preserve order and deduplicate
            
            // We need a better parser for the object string since some have emoji, some src, some nothing.
            // Split by "}, {" is tricky if there are commas inside.
            // But we know the format is exactly: `{ text: "Word" }` or `{ text: "Word", emoji: "X" }` etc.
            
            // Let's just find the text values, and if we've seen it, remove that object.
            // Actually, parsing the raw string:
            const items = arrayContent.split(/},\s*{/);
            const cleanItems = [];
            const seenTexts = new Set();
            
            for (let itemStr of items) {
                // Restore the braces if they were split
                if (!itemStr.startsWith('{')) itemStr = '{' + itemStr;
                if (!itemStr.endsWith('}')) itemStr = itemStr + '}';
                
                // Extract text
                const textMatch = itemStr.match(/text:\s*"([^"]+)"/);
                if (textMatch) {
                    // Ignore case comparison for safety (e.g. "Yo-Yo" vs "Yoyo")
                    const text = textMatch[1].toLowerCase().replace(/[^a-z]/g, '');
                    if (!seenTexts.has(text)) {
                        seenTexts.add(text);
                        // But wait! Is 'Rabbit' 'rabbit'? Yes. 
                        // What if they are identical? "Zebra" and "Zebra".
                        cleanItems.push(itemStr);
                    }
                }
            }
            
            newBlock += `    ${letter}: [ ${cleanItems.join(', ')} ],\n`;
        } else {
            newBlock += line + '\n';
        }
    }
    newBlock += '};\n';
    
    content = content.replace(oldBlock, newBlock);
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log("Successfully deduplicated alphabetData!");
} else {
    console.log("Failed to find alphabetData block.");
}
