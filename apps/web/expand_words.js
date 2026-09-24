const fs = require('fs');

const extraWords = {
    A: ["Arrow", "Anchor", "Axe", "Alligator", "Acorn", "Apricot", "Astronaut", "Apple Pie", "Alarm", "Abacus", "Accordion", "Almond", "Anemone", "Ape", "Armor", "Artichoke", "Asparagus", "Asteroid", "Atlas", "Automobile"],
    B: ["Balloon", "Bus", "Boat", "Bread", "Bed", "Butterfly", "Basket", "Bat", "Bell", "Belt", "Bench", "Binoculars", "Blanket", "Blender", "Block", "Blouse", "Board", "Boot", "Bottle", "Bowl"],
    C: ["Cup", "Camera", "Candy", "Castle", "Crab", "Carrot", "Cabbage", "Cabin", "Cactus", "Cage", "Calculator", "Calendar", "Camel", "Candle", "Canoe", "Cap", "Caravan", "Card", "Carpet", "Cart"],
    D: ["Drum", "Dress", "Donkey", "Desk", "Diamond", "Dart", "Deer", "Denim", "Desert", "Dial", "Diary", "Dice", "Dictionary", "Dish", "Disk", "Dock", "Document", "Doll", "Domino", "Doorbell"],
    E: ["Ear", "Earth", "Easel", "Engine", "Envelope", "Eraser", "Escalator", "Eskimo", "Espresso", "Emu", "Emerald", "Elk", "Electricity", "Eel", "Echo", "Eclipse", "Ecology", "Edifice", "Equestrian", "Excavator"],
    F: ["Face", "Fan", "Farm", "Feather", "Fence", "Ferry", "Field", "Fig", "File", "Film", "Finger", "Flag", "Flame", "Flashlight", "Fleece", "Flock", "Flute", "Fly", "Forest", "Fork"],
    G: ["Game", "Garage", "Garden", "Garlic", "Gate", "Gear", "Gem", "Gift", "Glass", "Glove", "Goat", "Gold", "Goose", "Gorilla", "Grain", "Grape", "Grass", "Grid", "Grill", "Guitarist"],
    H: ["Hair", "Hall", "Hammer", "Hammock", "Hamster", "Hand", "Harbor", "Harp", "Hawk", "Hay", "Head", "Helicopter", "Helmet", "Hen", "Hill", "Hippopotamus", "Hive", "Hole", "Honey", "Horn"],
    I: ["Iceberg", "Idea", "Iggy", "Image", "Impact", "Incense", "Inch", "Income", "Index", "Infant", "Ink", "Inn", "Insect", "Instrument", "Internet", "Inventor", "Iris", "Iron", "Island", "Ivory"],
    J: ["Jackal", "Jam", "Jar", "Jaw", "Jeep", "Jelly", "Jet", "Jewel", "Jigsaw", "Job", "Jockey", "Journal", "Judge", "Jug", "Juggler", "Juicer", "Jukebox", "Jump", "Jungle", "Junk"],
    K: ["Kale", "Kayak", "Kebab", "Kettle", "Keyboardist", "Kilt", "Kimono", "King", "Kiosk", "Kiss", "Kitchen", "Kitten", "Kiwi", "Knee", "Knife", "Knight", "Knot", "Koala", "Kumquat", "Kung-fu"],
    L: ["Lace", "Ladder", "Ladybug", "Lake", "Lamb", "Laptop", "Laser", "Lasso", "Latch", "Lathe", "Laundry", "Lawn", "Leaflet", "Leather", "Leek", "Leg", "Lemonade", "Lens", "Leopard", "Letter"],
    M: ["Macaroni", "Machine", "Magazine", "Magic", "Magnet", "Mail", "Mailbox", "Map", "Marble", "Mask", "Mat", "Match", "Meadow", "Meat", "Medal", "Medicine", "Melon", "Menu", "Metal", "Meter"],
    N: ["Nail", "Name", "Napkin", "Nature", "Neck", "Necklace", "Needle", "Neon", "Net", "Network", "Newspaper", "Night", "Nightingale", "Noodle", "North", "Note", "Novel", "Number", "Nurse", "Nutmeg"],
    O: ["Oar", "Oasis", "Oatmeal", "Obelisk", "Oboe", "Ocean", "Octagon", "Office", "Oil", "Olive", "Omelet", "Onion", "Opal", "Opera", "Orchard", "Orchid", "Organ", "Ostrich", "Otter", "Oven"],
    P: ["Package", "Pad", "Page", "Paint", "Painter", "Palace", "Palm", "Pan", "Pancake", "Paper", "Parachute", "Parrot", "Party", "Pasta", "Path", "Peach", "Peacock", "Pear", "Pearl", "Pencil"],
    Q: ["Quail", "Quarry", "Quartz", "Quasar", "Quill", "Quiver", "Quota", "Quote", "Queue", "Quack", "Quake", "Quality", "Quantity", "Quart", "Quarterback", "Quartet", "Quest", "Quick", "Quiet", "Quiz"],
    R: ["Rabbit", "Raccoon", "Race", "Radio", "Radish", "Raft", "Rail", "Railway", "Raincoat", "Raisin", "Rake", "Ramp", "Ranch", "Rat", "Ray", "Razor", "Record", "Rectangle", "Reef", "Refrigerator"],
    S: ["Saddle", "Sail", "Sailboat", "Salad", "Salmon", "Salt", "Sand", "Sandwich", "Satellite", "Sauce", "Sausage", "Saw", "Saxophone", "Scale", "Scarf", "School", "Scissors", "Scooter", "Screen", "Screw"],
    T: ["Table", "Tablet", "Taco", "Tail", "Tent", "Tiger", "Toad", "Toast", "Toe", "Tomato", "Tongue", "Tooth", "Toothbrush", "Top", "Tornado", "Towel", "Tower", "Town", "Toy", "Tractor"],
    U: ["Ukulele", "Umpire", "Uncle", "Underground", "Union", "Unit", "Universe", "University", "Urchin", "Urn", "Usage", "User", "Utensil", "Utility", "Utopia", "Up", "Update", "Upload", "Upper", "Uptown"],
    V: ["Vacuum", "Valley", "Van", "Vanilla", "Vegetable", "Vehicle", "Veil", "Vein", "Velvet", "Vendor", "Veneer", "Venom", "Vent", "Venue", "Verb", "Verse", "Version", "Vessel", "Vest", "Vet"],
    W: ["Waffle", "Wagon", "Waist", "Wall", "Wallet", "Walnut", "Walrus", "Wand", "Wardrobe", "Warehouse", "Washer", "Wasp", "Watchmaker", "Water", "Waterfall", "Wave", "Wax", "Web", "Weed", "Wheel"],
    X: ["Xenon", "Xerox", "Xylem", "Xylose", "Xylophonist", "X-axis", "X-ray tube", "Xenolith", "Xenobot", "Xeric", "Xerophyte", "Xiphias", "Xiphoid", "Xylograph", "Xylocarp", "Xenon lamp", "Xanthan", "Xanthic", "Xiphisternum", "Xylotomy"],
    Y: ["Yak", "Yam", "Yard", "Yarn", "Yawn", "Year", "Yeast", "Yellowstone", "Yen", "Yew", "Yield", "Yogurt", "Yolk", "Young", "Youth", "Yoyo", "Yurt", "Yucca", "Yule", "Yummy"],
    Z: ["Zebra", "Zero", "Zinc", "Zinnia", "Zip", "Zipper", "Zircon", "Zither", "Zodiac", "Zone", "Zoo", "Zoologist", "Zucchini", "Zephyr", "Zeppelin", "Ziggurat", "Zillion", "Zipline", "Zirconium", "Zloty"]
};

// We will read page.js and modify the alphabetData object
const targetFile = 'src/app/games/word-2-picture/page.js';
let content = fs.readFileSync(targetFile, 'utf8');

// We need to parse the existing alphabetData block
const startIdx = content.indexOf('const alphabetData = {');
const endIdx = content.indexOf('};', startIdx);
if (startIdx !== -1 && endIdx !== -1) {
    const oldBlock = content.substring(startIdx, endIdx + 2);
    
    // Let's rebuild the block manually to ensure perfect formatting
    // Instead of parsing the JS, we can just replace each line:
    // `A: [ { text: "Apple", src: ... }, ... ],`
    
    let newBlock = 'const alphabetData = {\n';
    
    // We will extract existing arrays line by line using regex
    const lines = oldBlock.split('\n');
    for (let i = 1; i < lines.length - 1; i++) {
        const line = lines[i];
        const match = line.match(/^\s*([A-Z]):\s*\[(.*)\]\s*,?$/);
        if (match) {
            const letter = match[1];
            const existingArrayContent = match[2].trim();
            
            // Generate the extra words
            const extras = extraWords[letter];
            let extraString = '';
            if (extras) {
                extraString = extras.map(word => `, { text: "${word}", emoji: "❓" }`).join(''); // Default to Question Mark emoji if no src/emoji? Wait, if we omit src and emoji, the logic does `...(itemData.src ? { src: itemData.src } : { emoji: itemData.emoji })`. If both are missing, it will fetch from /api/image using `picture.alt`!
                // Let's just omit emoji and src so it falls back to /api/image
                extraString = extras.map(word => `, { text: "${word}" }`).join('');
            }
            
            newBlock += `    ${letter}: [ ${existingArrayContent}${extraString} ],\n`;
        }
    }
    newBlock += '};\n';
    
    content = content.replace(oldBlock, newBlock);
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log("Successfully appended extra words to alphabetData!");
} else {
    console.log("Failed to find alphabetData block.");
}
