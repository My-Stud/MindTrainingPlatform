"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react";
import Image from "next/image";

// Game levels data with rich text colors and HD images
const alphabetData = {
    A: [ { text: "Apple", src: "/images/word-2-picture/apple.png" }, { text: "Ant", src: "/images/word-2-picture/ant-new.png" }, { text: "Airplane", emoji: "✈️" }, { text: "Alien", emoji: "👽" }, { text: "Avocado", emoji: "🥑" }, { text: "Arrow" }, { text: "Anchor" }, { text: "Axe" }, { text: "Alligator" }, { text: "Acorn" }, { text: "Apricot" }, { text: "Astronaut" }, { text: "Apple Pie" }, { text: "Alarm" }, { text: "Abacus" }, { text: "Accordion" }, { text: "Almond" }, { text: "Anemone" }, { text: "Ape" }, { text: "Armor" }, { text: "Artichoke" }, { text: "Asparagus" }, { text: "Asteroid" }, { text: "Atlas" }, { text: "Automobile" } ],
    B: [ { text: "Book", src: "/images/word-2-picture/book.png" }, { text: "Ball", src: "/images/word-2-picture/ball-new.png" }, { text: "Bear", src: "/images/word-2-picture/bear-new.png" }, { text: "Bicycle", emoji: "🚲" }, { text: "Banana", emoji: "🍌" }, { text: "Balloon" }, { text: "Bus" }, { text: "Boat" }, { text: "Bread" }, { text: "Bed" }, { text: "Butterfly" }, { text: "Basket" }, { text: "Bat" }, { text: "Bell" }, { text: "Belt" }, { text: "Bench" }, { text: "Binoculars" }, { text: "Blanket" }, { text: "Blender" }, { text: "Block" }, { text: "Blouse" }, { text: "Board" }, { text: "Boot" }, { text: "Bottle" }, { text: "Bowl" } ],
    C: [ { text: "Cat", src: "/images/word-2-picture/cat.png" }, { text: "Car", emoji: "🚗" }, { text: "Cloud", emoji: "☁️" }, { text: "Cake", emoji: "🎂" }, { text: "Cow", emoji: "🐮" }, { text: "Cup" }, { text: "Camera" }, { text: "Candy" }, { text: "Castle" }, { text: "Crab" }, { text: "Carrot" }, { text: "Cabbage" }, { text: "Cabin" }, { text: "Cactus" }, { text: "Cage" }, { text: "Calculator" }, { text: "Calendar" }, { text: "Camel" }, { text: "Candle" }, { text: "Canoe" }, { text: "Cap" }, { text: "Caravan" }, { text: "Card" }, { text: "Carpet" }, { text: "Cart" } ],
    D: [ { text: "Dog", src: "/images/word-2-picture/dog.png" }, { text: "Duck", src: "/images/word-2-picture/duck-new.png" }, { text: "Dolphin", emoji: "🐬" }, { text: "Dinosaur", emoji: "🦖" }, { text: "Door", emoji: "🚪" }, { text: "Drum" }, { text: "Dress" }, { text: "Donkey" }, { text: "Desk" }, { text: "Diamond" }, { text: "Dart" }, { text: "Deer" }, { text: "Denim" }, { text: "Desert" }, { text: "Dial" }, { text: "Diary" }, { text: "Dice" }, { text: "Dictionary" }, { text: "Dish" }, { text: "Disk" }, { text: "Dock" }, { text: "Document" }, { text: "Doll" }, { text: "Domino" }, { text: "Doorbell" } ],
    E: [ { text: "Elephant", emoji: "🐘" }, { text: "Eagle", src: "/images/word-2-picture/eagle.png" }, { text: "Eye", emoji: "👁️" }, { text: "Egg", emoji: "🥚" }, { text: "Ear" }, { text: "Earth" }, { text: "Easel" }, { text: "Engine" }, { text: "Envelope" }, { text: "Eraser" }, { text: "Escalator" }, { text: "Eskimo" }, { text: "Espresso" }, { text: "Emu" }, { text: "Emerald" }, { text: "Elk" }, { text: "Electricity" }, { text: "Eel" }, { text: "Echo" }, { text: "Eclipse" }, { text: "Ecology" }, { text: "Edifice" }, { text: "Equestrian" }, { text: "Excavator" } ],
    F: [ { text: "Flower", emoji: "🌸" }, { text: "Frog", src: "/images/word-2-picture/frog.png" }, { text: "Fish", emoji: "🐟" }, { text: "Fire", emoji: "🔥" }, { text: "Face" }, { text: "Fan" }, { text: "Farm" }, { text: "Feather" }, { text: "Fence" }, { text: "Ferry" }, { text: "Field" }, { text: "Fig" }, { text: "File" }, { text: "Film" }, { text: "Finger" }, { text: "Flag" }, { text: "Flame" }, { text: "Flashlight" }, { text: "Fleece" }, { text: "Flock" }, { text: "Flute" }, { text: "Fly" }, { text: "Forest" }, { text: "Fork" } ],
    G: [ { text: "Guitar", emoji: "🎸" }, { text: "Giraffe", src: "/images/word-2-picture/giraffe.png" }, { text: "Ghost", src: "/images/word-2-picture/ghost-new.png" }, { text: "Globe", emoji: "🌍" }, { text: "Game" }, { text: "Garage" }, { text: "Garden" }, { text: "Garlic" }, { text: "Gate" }, { text: "Gear" }, { text: "Gem" }, { text: "Gift" }, { text: "Glass" }, { text: "Glove" }, { text: "Goat" }, { text: "Gold" }, { text: "Goose" }, { text: "Gorilla" }, { text: "Grain" }, { text: "Grape" }, { text: "Grass" }, { text: "Grid" }, { text: "Grill" }, { text: "Guitarist" } ],
    H: [ { text: "House", emoji: "🏠" }, { text: "Hat", src: "/images/word-2-picture/hat.png" }, { text: "Horse", src: "/images/word-2-picture/horse-new.png" }, { text: "Heart", emoji: "❤️" }, { text: "Hair" }, { text: "Hall" }, { text: "Hammer" }, { text: "Hammock" }, { text: "Hamster" }, { text: "Hand" }, { text: "Harbor" }, { text: "Harp" }, { text: "Hawk" }, { text: "Hay" }, { text: "Head" }, { text: "Helicopter" }, { text: "Helmet" }, { text: "Hen" }, { text: "Hill" }, { text: "Hippopotamus" }, { text: "Hive" }, { text: "Hole" }, { text: "Honey" }, { text: "Horn" } ],
    I: [ { text: "Ice Cream", emoji: "🍦" }, { text: "Igloo", src: "/images/word-2-picture/igloo.png" }, { text: "Island", emoji: "🏝️" }, { text: "Ice", emoji: "🧊" }, { text: "Iceberg" }, { text: "Idea" }, { text: "Iggy" }, { text: "Image" }, { text: "Impact" }, { text: "Incense" }, { text: "Inch" }, { text: "Income" }, { text: "Index" }, { text: "Infant" }, { text: "Ink" }, { text: "Inn" }, { text: "Insect" }, { text: "Instrument" }, { text: "Internet" }, { text: "Inventor" }, { text: "Iris" }, { text: "Iron" }, { text: "Ivory" } ],
    J: [ { text: "Jeans", src: "/images/word-2-picture/jeans.png" }, { text: "Juice", src: "/images/word-2-picture/juice.png" }, { text: "Jellyfish", emoji: "🪼" }, { text: "Jacket", emoji: "🧥" }, { text: "Jackal" }, { text: "Jam" }, { text: "Jar" }, { text: "Jaw" }, { text: "Jeep" }, { text: "Jelly" }, { text: "Jet" }, { text: "Jewel" }, { text: "Jigsaw" }, { text: "Job" }, { text: "Jockey" }, { text: "Journal" }, { text: "Judge" }, { text: "Jug" }, { text: "Juggler" }, { text: "Juicer" }, { text: "Jukebox" }, { text: "Jump" }, { text: "Jungle" }, { text: "Junk" } ],
    K: [ { text: "Key", src: "/images/word-2-picture/key-new.png" }, { text: "Kite", src: "/images/word-2-picture/kite.png" }, { text: "Kangaroo", emoji: "🦘" }, { text: "Keyboard", emoji: "⌨️" }, { text: "Kale" }, { text: "Kayak" }, { text: "Kebab" }, { text: "Kettle" }, { text: "Keyboardist" }, { text: "Kilt" }, { text: "Kimono" }, { text: "King" }, { text: "Kiosk" }, { text: "Kiss" }, { text: "Kitchen" }, { text: "Kitten" }, { text: "Kiwi" }, { text: "Knee" }, { text: "Knife" }, { text: "Knight" }, { text: "Knot" }, { text: "Koala" }, { text: "Kumquat" }, { text: "Kung-fu" } ],
    L: [ { text: "Lion", emoji: "🦁" }, { text: "Leaf", src: "/images/word-2-picture/leaf.png" }, { text: "Lemon", emoji: "🍋" }, { text: "Lamp", emoji: "💡" }, { text: "Lace" }, { text: "Ladder" }, { text: "Ladybug" }, { text: "Lake" }, { text: "Lamb" }, { text: "Laptop" }, { text: "Laser" }, { text: "Lasso" }, { text: "Latch" }, { text: "Lathe" }, { text: "Laundry" }, { text: "Lawn" }, { text: "Leaflet" }, { text: "Leather" }, { text: "Leek" }, { text: "Leg" }, { text: "Lemonade" }, { text: "Lens" }, { text: "Leopard" }, { text: "Letter" } ],
    M: [ { text: "Moon", src: "/images/word-2-picture/moon.png" }, { text: "Monkey", emoji: "🐒" }, { text: "Mouse", emoji: "🐭" }, { text: "Mushroom", emoji: "🍄" }, { text: "Macaroni" }, { text: "Machine" }, { text: "Magazine" }, { text: "Magic" }, { text: "Magnet" }, { text: "Mail" }, { text: "Mailbox" }, { text: "Map" }, { text: "Marble" }, { text: "Mask" }, { text: "Mat" }, { text: "Match" }, { text: "Meadow" }, { text: "Meat" }, { text: "Medal" }, { text: "Medicine" }, { text: "Melon" }, { text: "Menu" }, { text: "Metal" }, { text: "Meter" } ],
    N: [ { text: "Notebook", src: "/images/word-2-picture/notebook-new.png" }, { text: "Nest", src: "/images/word-2-picture/nest.png" }, { text: "Nose", emoji: "👃" }, { text: "Nut", emoji: "🥜" }, { text: "Nail" }, { text: "Name" }, { text: "Napkin" }, { text: "Nature" }, { text: "Neck" }, { text: "Necklace" }, { text: "Needle" }, { text: "Neon" }, { text: "Net" }, { text: "Network" }, { text: "Newspaper" }, { text: "Night" }, { text: "Nightingale" }, { text: "Noodle" }, { text: "North" }, { text: "Note" }, { text: "Novel" }, { text: "Number" }, { text: "Nurse" }, { text: "Nutmeg" } ],
    O: [ { text: "Owl", src: "/images/word-2-picture/owl-new.png" }, { text: "Orange", src: "/images/word-2-picture/orange.png" }, { text: "Octopus", emoji: "🐙" }, { text: "Ocean", emoji: "🌊" }, { text: "Oar" }, { text: "Oasis" }, { text: "Oatmeal" }, { text: "Obelisk" }, { text: "Oboe" }, { text: "Octagon" }, { text: "Office" }, { text: "Oil" }, { text: "Olive" }, { text: "Omelet" }, { text: "Onion" }, { text: "Opal" }, { text: "Opera" }, { text: "Orchard" }, { text: "Orchid" }, { text: "Organ" }, { text: "Ostrich" }, { text: "Otter" }, { text: "Oven" } ],
    P: [ { text: "Penguin", src: "/images/word-2-picture/penguin.png" }, { text: "Pig", src: "/images/word-2-picture/pig.png" }, { text: "Pizza", emoji: "🍕" }, { text: "Panda", emoji: "🐼" }, { text: "Package" }, { text: "Pad" }, { text: "Page" }, { text: "Paint" }, { text: "Painter" }, { text: "Palace" }, { text: "Palm" }, { text: "Pan" }, { text: "Pancake" }, { text: "Paper" }, { text: "Parachute" }, { text: "Parrot" }, { text: "Party" }, { text: "Pasta" }, { text: "Path" }, { text: "Peach" }, { text: "Peacock" }, { text: "Pear" }, { text: "Pearl" }, { text: "Pencil" } ],
    Q: [ { text: "Queen", src: "/images/word-2-picture/queen-new.png" }, { text: "Quilt", src: "/images/word-2-picture/quilt.png" }, { text: "Question", emoji: "❓" }, { text: "Quarter", emoji: "🪙" }, { text: "Quail" }, { text: "Quarry" }, { text: "Quartz" }, { text: "Quasar" }, { text: "Quill" }, { text: "Quiver" }, { text: "Quota" }, { text: "Quote" }, { text: "Queue" }, { text: "Quack" }, { text: "Quake" }, { text: "Quality" }, { text: "Quantity" }, { text: "Quart" }, { text: "Quarterback" }, { text: "Quartet" }, { text: "Quest" }, { text: "Quick" }, { text: "Quiet" }, { text: "Quiz" } ],
    R: [ { text: "Rain", src: "/images/word-2-picture/rain.png" }, { text: "Rocket", src: "/images/word-2-picture/rocket.png" }, { text: "Rabbit", emoji: "🐰" }, { text: "Robot", emoji: "🤖" }, { text: "Raccoon" }, { text: "Race" }, { text: "Radio" }, { text: "Radish" }, { text: "Raft" }, { text: "Rail" }, { text: "Railway" }, { text: "Raincoat" }, { text: "Raisin" }, { text: "Rake" }, { text: "Ramp" }, { text: "Ranch" }, { text: "Rat" }, { text: "Ray" }, { text: "Razor" }, { text: "Record" }, { text: "Rectangle" }, { text: "Reef" }, { text: "Refrigerator" } ],
    S: [ { text: "Sun", src: "/images/word-2-picture/sun.png" }, { text: "Star", src: "/images/word-2-picture/star.png" }, { text: "Snow", emoji: "❄️" }, { text: "Snake", emoji: "🐍" }, { text: "Saddle" }, { text: "Sail" }, { text: "Sailboat" }, { text: "Salad" }, { text: "Salmon" }, { text: "Salt" }, { text: "Sand" }, { text: "Sandwich" }, { text: "Satellite" }, { text: "Sauce" }, { text: "Sausage" }, { text: "Saw" }, { text: "Saxophone" }, { text: "Scale" }, { text: "Scarf" }, { text: "School" }, { text: "Scissors" }, { text: "Scooter" }, { text: "Screen" }, { text: "Screw" } ],
    T: [ { text: "Tree", emoji: "🌳" }, { text: "Tiger", emoji: "🐯" }, { text: "Train", emoji: "🚂" }, { text: "Turtle", emoji: "🐢" }, { text: "Table" }, { text: "Tablet" }, { text: "Taco" }, { text: "Tail" }, { text: "Tent" }, { text: "Toad" }, { text: "Toast" }, { text: "Toe" }, { text: "Tomato" }, { text: "Tongue" }, { text: "Tooth" }, { text: "Toothbrush" }, { text: "Top" }, { text: "Tornado" }, { text: "Towel" }, { text: "Tower" }, { text: "Town" }, { text: "Toy" }, { text: "Tractor" } ],
    U: [ { text: "Umbrella", src: "/images/word-2-picture/umbrella-new.png" }, { text: "Unicorn", src: "/images/word-2-picture/unicorn.png" }, { text: "UFO", emoji: "🛸" }, { text: "Uniform", emoji: "🥋" }, { text: "Ukulele" }, { text: "Umpire" }, { text: "Uncle" }, { text: "Underground" }, { text: "Union" }, { text: "Unit" }, { text: "Universe" }, { text: "University" }, { text: "Urchin" }, { text: "Urn" }, { text: "Usage" }, { text: "User" }, { text: "Utensil" }, { text: "Utility" }, { text: "Utopia" }, { text: "Up" }, { text: "Update" }, { text: "Upload" }, { text: "Upper" }, { text: "Uptown" } ],
    V: [ { text: "Violin", emoji: "🎻" }, { text: "Volcano", src: "/images/word-2-picture/volcano.png" }, { text: "Vase", src: "/images/word-2-picture/vase.png" }, { text: "Vampire", emoji: "🧛" }, { text: "Vacuum" }, { text: "Valley" }, { text: "Van" }, { text: "Vanilla" }, { text: "Vegetable" }, { text: "Vehicle" }, { text: "Veil" }, { text: "Vein" }, { text: "Velvet" }, { text: "Vendor" }, { text: "Veneer" }, { text: "Venom" }, { text: "Vent" }, { text: "Venue" }, { text: "Verb" }, { text: "Verse" }, { text: "Version" }, { text: "Vessel" }, { text: "Vest" }, { text: "Vet" } ],
    W: [ { text: "Watermelon", emoji: "🍉" }, { text: "Whale", src: "/images/word-2-picture/whale.png" }, { text: "Watch", emoji: "⌚" }, { text: "Window", emoji: "🪟" }, { text: "Waffle" }, { text: "Wagon" }, { text: "Waist" }, { text: "Wall" }, { text: "Wallet" }, { text: "Walnut" }, { text: "Walrus" }, { text: "Wand" }, { text: "Wardrobe" }, { text: "Warehouse" }, { text: "Washer" }, { text: "Wasp" }, { text: "Watchmaker" }, { text: "Water" }, { text: "Waterfall" }, { text: "Wave" }, { text: "Wax" }, { text: "Web" }, { text: "Weed" }, { text: "Wheel" } ],
    X: [ { text: "X-Ray", src: "/images/word-2-picture/xray-new.png" }, { text: "Xylophone", src: "/images/word-2-picture/xylophone.png" }, { text: "Xmas Tree", emoji: "🎄" }, { text: "Xenops", emoji: "🐦" }, { text: "Xenon" }, { text: "Xerox" }, { text: "Xylem" }, { text: "Xylose" }, { text: "Xylophonist" }, { text: "X-axis" }, { text: "X-ray tube" }, { text: "Xenolith" }, { text: "Xenobot" }, { text: "Xeric" }, { text: "Xerophyte" }, { text: "Xiphias" }, { text: "Xiphoid" }, { text: "Xylograph" }, { text: "Xylocarp" }, { text: "Xenon lamp" }, { text: "Xanthan" }, { text: "Xanthic" }, { text: "Xiphisternum" }, { text: "Xylotomy" } ],
    Y: [ { text: "Yo-Yo", src: "/images/word-2-picture/yoyo-new.png" }, { text: "Yacht", src: "/images/word-2-picture/yacht.png" }, { text: "Yarn", emoji: "🧶" }, { text: "Yellow", emoji: "🟨" }, { text: "Yak" }, { text: "Yam" }, { text: "Yard" }, { text: "Yawn" }, { text: "Year" }, { text: "Yeast" }, { text: "Yellowstone" }, { text: "Yen" }, { text: "Yew" }, { text: "Yield" }, { text: "Yogurt" }, { text: "Yolk" }, { text: "Young" }, { text: "Youth" }, { text: "Yurt" }, { text: "Yucca" }, { text: "Yule" }, { text: "Yummy" } ],
    Z: [ { text: "Zebra", src: "/images/word-2-picture/zebra-new.png" }, { text: "Zoo", src: "/images/word-2-picture/zoo.png" }, { text: "Zombie", emoji: "🧟" }, { text: "Zipper", emoji: "🤐" }, { text: "Zero" }, { text: "Zinc" }, { text: "Zinnia" }, { text: "Zip" }, { text: "Zircon" }, { text: "Zither" }, { text: "Zodiac" }, { text: "Zone" }, { text: "Zoologist" }, { text: "Zucchini" }, { text: "Zephyr" }, { text: "Zeppelin" }, { text: "Ziggurat" }, { text: "Zillion" }, { text: "Zipline" }, { text: "Zirconium" }, { text: "Zloty" } ],
};



const colorPalette = [
    "from-red-500 to-rose-700",
    "from-amber-400 to-orange-600",
    "from-blue-500 to-indigo-700",
    "from-emerald-500 to-green-700",
    "from-purple-500 to-fuchsia-700",
    "from-cyan-400 to-blue-600",
    "from-yellow-500 to-orange-700",
    "from-pink-500 to-rose-700",
    "from-orange-400 to-yellow-600",
    "from-slate-400 to-zinc-600",
    "from-sky-300 to-blue-500",
    "from-yellow-300 to-amber-500"
];

function generateLevels(numLevels = 50) {
    const generatedLevels = [];
    let alphabetIndex = 0;
    const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const usageCount = {};
    ALPHABET.forEach(letter => usageCount[letter] = 0);

    for (let i = 0; i < numLevels; i++) {
        const levelNum = i + 1;
        const itemCount = 4 + i;
        
        const words = [];
        const pictures = [];
        
        for (let j = 0; j < itemCount; j++) {
            const letter = ALPHABET[alphabetIndex];
            const variants = alphabetData[letter];
            const variantIndex = usageCount[letter] % variants.length;
            const itemData = variants[variantIndex];
            
            usageCount[letter]++;
            alphabetIndex = (alphabetIndex + 1) % 26;
            
            const color = colorPalette[j % colorPalette.length];
            const matchId = `w_${levelNum}_${letter}_${j}`;
            
            words.push({
                id: matchId,
                text: itemData.text,
                color: color
            });
            
            pictures.push({
                id: `p_${levelNum}_${letter}_${j}`,
                matchId: matchId,
                alt: itemData.text,
                ...(itemData.src ? { src: itemData.src } : { emoji: itemData.emoji })
            });
        }
        
        generatedLevels.push({
            level: levelNum,
            words,
            pictures
        });
    }
    
    return generatedLevels;
}

const levels = generateLevels();

// Helper to shuffle arrays
function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

export default function Word2PictureGame() {
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [words, setWords] = useState([]);
    const [pictures, setPictures] = useState([]);
    const [matches, setMatches] = useState({}); // mapping: pictureId -> wordId
    const [score, setScore] = useState(0);
    const [levelComplete, setLevelComplete] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [draggedWordId, setDraggedWordId] = useState(null);
    const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }

    // Initialize game
    useEffect(() => {
        loadLevel(0);
    }, []);

    const loadLevel = (levelIndex) => {
        const levelData = levels[levelIndex];
        setWords(shuffle(levelData.words));
        setPictures(shuffle(levelData.pictures));
        setMatches({});
        setLevelComplete(false);
        setDraggedWordId(null);
        setFeedback(null);
    };

    const resetGame = () => {
        setScore(0);
        setGameOver(false);
        setCurrentLevelIndex(0);
        loadLevel(0);
    };

    const nextLevel = () => {
        if (currentLevelIndex < levels.length - 1) {
            const nextIdx = currentLevelIndex + 1;
            setCurrentLevelIndex(nextIdx);
            loadLevel(nextIdx);
        } else {
            setGameOver(true);
            setLevelComplete(false);
        }
    };

    const handleDragStart = (e, wordId) => {
        setDraggedWordId(wordId);
        e.dataTransfer.setData("text/plain", wordId);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // allow dropping
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e, picture) => {
        e.preventDefault();
        const wordId = e.dataTransfer.getData("text/plain");

        if (!wordId || matches[picture.id]) return; // if picture already has a match, do nothing

        const isCorrect = picture.matchId === wordId;

        if (isCorrect) {
            setScore(s => s + 10);
            setFeedback({ type: 'success', message: 'Correct! +10 Points 🌟' });
        } else {
            setScore(s => s - 2);
            setFeedback({ type: 'error', message: 'Oops! Wrong match. -2 Points ❌' });
        }
        
        setMatches(prev => {
            const newMatches = { ...prev, [picture.id]: wordId };
            const currentLevelData = levels[currentLevelIndex];
            
            // Check if user attempted all options
            if (Object.keys(newMatches).length === currentLevelData.pictures.length) {
                let correctCount = 0;
                for (const p of currentLevelData.pictures) {
                    if (newMatches[p.id] === p.matchId) correctCount++;
                }
                const requiredMatches = Math.ceil(currentLevelData.pictures.length * 0.5);
                
                setTimeout(() => {
                    if (correctCount >= requiredMatches) {
                        if (currentLevelIndex < levels.length - 1) {
                            setLevelComplete(true);
                        } else {
                            setGameOver(true);
                        }
                    } else {
                        setGameOver(true); // Failed to reach 50%
                    }
                }, 1500); // slight delay for last drop animation
            }
            return newMatches;
        });
        
        // Clear feedback after a short duration
        setTimeout(() => setFeedback(null), 2000);
        setDraggedWordId(null);
    };

    // Filter out words that have been successfully matched
    const matchedWordIds = Object.values(matches);
    const remainingWords = words.filter(w => !matchedWordIds.includes(w.id));

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link
                        href="/games"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 hover:text-primary-600 transition-colors shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Free Game Zone
                    </Link>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-primary-100 text-primary-800 px-6 py-3 rounded-full font-black text-xl shadow-md border-2 border-primary-200">
                            <Trophy className="w-6 h-6 text-primary-600" />
                            Score: {score}
                        </div>
                        <button
                            onClick={resetGame}
                            className="p-3 rounded-full bg-white shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-100 hover:rotate-180 transition-all duration-500"
                            title="Reset Game"
                        >
                            <RotateCcw className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="text-center mb-8 relative">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight drop-shadow-sm bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">Word 2 Picture</h1>
                    <div className="text-2xl font-bold text-primary-600 mb-2">Level {currentLevelIndex + 1}</div>
                    <p className="text-lg text-gray-600 font-medium max-w-xl mx-auto">
                        Drag the colorful words and drop them onto the correct picture!
                    </p>
                    
                    {/* Feedback Toast */}
                    <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-full max-w-sm z-50">
                        {feedback && (
                            <div className={`
                                px-6 py-3 rounded-full font-bold text-lg flex items-center justify-center gap-3 shadow-xl
                                animate-in slide-in-from-top-4 fade-in duration-300
                                ${feedback.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
                            `}>
                                {feedback.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                                {feedback.message}
                            </div>
                        )}
                    </div>
                </div>

                {levelComplete ? (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-2xl border border-gray-100 animate-in zoom-in duration-500 max-w-2xl mx-auto mt-12">
                        <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border-4 border-green-200">
                            <CheckCircle2 className="w-16 h-16 text-green-500" />
                        </div>
                        <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">Level {currentLevelIndex + 1} Complete!</h2>
                        <p className="text-2xl text-gray-600 font-bold mb-10">Great job! Get ready for the next one.</p>
                        <button
                            onClick={nextLevel}
                            className="bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white font-black text-2xl px-10 py-5 rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border-4 border-primary-400/30"
                        >
                            Next Level
                        </button>
                    </div>
                ) : gameOver ? (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-2xl border border-gray-100 animate-in zoom-in duration-500 max-w-2xl mx-auto mt-12">
                        <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border-4 border-yellow-200">
                            <Trophy className="w-16 h-16 text-yellow-500" />
                        </div>
                        <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">
                            {currentLevelIndex < levels.length - 1 ? "Level Failed!" : "Game Over!"}
                        </h2>
                        <p className="text-2xl text-gray-600 font-bold mb-10">You scored a total of <span className="text-primary-600 text-4xl">{score}</span> points.</p>
                        <button
                            onClick={resetGame}
                            className="bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white font-black text-2xl px-10 py-5 rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border-4 border-primary-400/30"
                        >
                            Play Again
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 bg-white/50 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-lg border border-gray-200 items-start">
                            
                            {/* Left Column: Words */}
                            <div className="space-y-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                <h3 className="text-3xl font-black text-gray-800 mb-6 text-center tracking-tight">Words to Match</h3>
                                <div className="grid grid-cols-2 gap-6">
                                {remainingWords.map(word => (
                                    <div
                                        key={word.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, word.id)}
                                        onDragEnd={() => setDraggedWordId(null)}
                                        className={`
                                            aspect-square flex items-center justify-center p-4 rounded-3xl bg-gradient-to-br ${word.color}
                                            text-center font-black text-white shadow-lg cursor-grab active:cursor-grabbing flex-col
                                            hover:shadow-2xl hover:scale-105 transition-all duration-300 drop-shadow-md border-4 border-white/40
                                            ${draggedWordId === word.id ? 'opacity-50 scale-95' : 'opacity-100'}
                                        `}
                                    >
                                            <span className="drop-shadow-lg tracking-wide text-xl md:text-2xl lg:text-3xl break-words w-full leading-tight px-1">{word.text}</span>
                                        </div>
                                ))}
                                {remainingWords.length === 0 && (
                                    <div className="col-span-2 flex items-center justify-center min-h-[300px]">
                                        <div className="text-gray-400 font-bold text-xl italic bg-gray-50 px-8 py-4 rounded-full border border-gray-200">
                                            All words matched! 🌟
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                            {/* Right Column: Pictures */}
                            <div className="space-y-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                <h3 className="text-3xl font-black text-gray-800 mb-6 text-center tracking-tight">Find the Picture</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    {pictures.filter(p => !matches[p.id]).map(picture => {
                                    const isMatched = !!matches[picture.id];
                                    const isCorrectMatch = isMatched && matches[picture.id] === picture.matchId;
                                    const isWrongMatch = isMatched && matches[picture.id] !== picture.matchId;
                                    const matchedWord = isMatched ? levels[currentLevelIndex].words.find(w => w.id === matches[picture.id]) : null;

                                    return (
                                        <div
                                            key={picture.id}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, picture)}
                                            className={`
                                                relative aspect-square rounded-3xl border-4 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 shadow-md bg-gray-50
                                                ${isCorrectMatch ? 'border-green-400 ring-4 ring-green-100 scale-100' : ''}
                                                ${isWrongMatch ? 'border-red-400 ring-4 ring-red-100 scale-100' : ''}
                                                ${!isMatched ? 'border-transparent hover:border-primary-400 hover:shadow-2xl hover:scale-105' : ''}
                                                ${draggedWordId && !isMatched ? 'animate-pulse border-primary-200' : ''}
                                            `}
                                        >
                                                <Image 
                                                    src={['Sun', 'Rain', 'Ghost', 'Horse', 'Bear', 'Yacht', 'Zoo', 'Xylophone', 'Zombie', 'Xmas Tree', 'UFO', 'Dinosaur', 'Jacket', 'Lamp', 'Keyboard', 'Quarter', 'Nut', 'Ocean', 'Ice', 'Robot', 'Turtle', 'Yellow', 'Uniform', 'Xenops'].includes(picture.alt) ? `/images/word-2-picture/${['Ghost', 'Horse', 'Bear', 'Xmas Tree', 'Zombie', 'UFO', 'Dinosaur', 'Jacket', 'Lamp', 'Keyboard', 'Quarter', 'Nut', 'Ocean', 'Ice', 'Robot', 'Turtle', 'Yellow', 'Uniform', 'Xenops'].includes(picture.alt) ? picture.alt.toLowerCase().replace(' ', '-') + '-new' : picture.alt.toLowerCase()}.png?v=9` : `/api/image?q=${encodeURIComponent(picture.alt)}&v=9`} 
                                                    alt={picture.alt} 
                                                    fill 
                                                    className={`${['Yo-Yo', 'Eye', 'Quarter', 'Nut'].includes(picture.alt) ? 'object-contain' : 'object-cover'} p-3 transition-all duration-500 ${isMatched ? 'scale-110 opacity-60' : 'scale-100'}`}
                                                    draggable={false} 
                                                    sizes="(max-width: 768px) 50vw, 33vw"
                                                    unoptimized={true}
                                                />
                                            
                                            {isMatched && (
                                                <div className={`absolute inset-0 ${isCorrectMatch ? 'bg-black/50' : 'bg-red-900/60'} flex items-center justify-center backdrop-blur-[2px] animate-in zoom-in duration-300`}>
                                                    <span className={`font-black text-3xl md:text-4xl drop-shadow-2xl tracking-wider -rotate-12 scale-110 ${isCorrectMatch ? 'text-white' : 'text-red-100'}`}>
                                                        {matchedWord?.text}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Matched Items Section */}
                        {Object.keys(matches).length > 0 && (
                            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-lg border border-gray-200 mt-8">
                                <h3 className="text-3xl font-black text-gray-800 mb-6 text-center tracking-tight text-green-600 flex items-center justify-center gap-3">
                                    <CheckCircle2 className="w-8 h-8" />
                                    Matched Items
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {pictures.filter(p => matches[p.id]).map(picture => {
                                        const isMatched = true;
                                        const isCorrectMatch = matches[picture.id] === picture.matchId;
                                        const isWrongMatch = matches[picture.id] !== picture.matchId;
                                        const matchedWord = levels[currentLevelIndex].words.find(w => w.id === matches[picture.id]);

                                        return (
                                            <div
                                                key={picture.id}
                                                className={`
                                                    relative aspect-square rounded-3xl border-4 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 shadow-md bg-gray-50
                                                    ${isCorrectMatch ? 'border-green-400 ring-4 ring-green-100' : 'border-red-400 ring-4 ring-red-100'}
                                                `}
                                            >
                                                    <Image 
                                                        src={['Sun', 'Rain', 'Ghost', 'Horse', 'Bear', 'Yacht', 'Zoo', 'Xylophone', 'Zombie', 'Xmas Tree', 'UFO', 'Dinosaur', 'Jacket', 'Lamp', 'Keyboard', 'Quarter', 'Nut', 'Ocean', 'Ice', 'Robot', 'Turtle', 'Yellow', 'Uniform', 'Xenops'].includes(picture.alt) ? `/images/word-2-picture/${['Ghost', 'Horse', 'Bear', 'Xmas Tree', 'Zombie', 'UFO', 'Dinosaur', 'Jacket', 'Lamp', 'Keyboard', 'Quarter', 'Nut', 'Ocean', 'Ice', 'Robot', 'Turtle', 'Yellow', 'Uniform', 'Xenops'].includes(picture.alt) ? picture.alt.toLowerCase().replace(' ', '-') + '-new' : picture.alt.toLowerCase()}.png?v=9` : `/api/image?q=${encodeURIComponent(picture.alt)}&v=9`} 
                                                        alt={picture.alt} 
                                                        fill 
                                                        className={`${['Yo-Yo', 'Eye', 'Quarter', 'Nut'].includes(picture.alt) ? 'object-contain' : 'object-cover'} p-3 opacity-60 scale-110`}
                                                        draggable={false} 
                                                        sizes="(max-width: 768px) 50vw, 33vw"
                                                        unoptimized={true}
                                                    />
                                                
                                                <div className={`absolute inset-0 ${isCorrectMatch ? 'bg-black/50' : 'bg-red-900/60'} flex items-center justify-center backdrop-blur-[2px] animate-in zoom-in duration-300`}>
                                                    <span className={`font-black text-3xl md:text-4xl drop-shadow-2xl tracking-wider -rotate-12 scale-110 ${isCorrectMatch ? 'text-white' : 'text-red-100'}`}>
                                                        {matchedWord?.text}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        
      {/* Fullscreen Button Injected */}
      <div className="fixed bottom-6 right-6 z-[9999] opacity-90 hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => {
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
              elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
              elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
              elem.msRequestFullscreen();
            }
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 font-bold transition-transform transform hover:scale-105 active:scale-95"
          title="Click to view full game (Press ESC to exit)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
          Full Screen
        </button>
      </div>
    </div>
  );
}