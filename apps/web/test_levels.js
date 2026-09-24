const alphabetData = {
    A: [ { text: "Apple" }, { text: "Ant" }, { text: "Airplane" }, { text: "Alien" } ],
    B: [ { text: "Book" }, { text: "Ball" }, { text: "Bear" }, { text: "Bicycle" } ],
    C: [ { text: "Cat" }, { text: "Car" }, { text: "Cloud" }, { text: "Cake" } ],
    D: [ { text: "Dog" }, { text: "Duck" }, { text: "Dolphin" }, { text: "Dinosaur" } ],
    E: [ { text: "Elephant" }, { text: "Eagle" }, { text: "Eye" }, { text: "Egg" } ],
    F: [ { text: "Flower" }, { text: "Frog" }, { text: "Fish" }, { text: "Fire" } ],
    G: [ { text: "Guitar" }, { text: "Giraffe" }, { text: "Ghost" }, { text: "Globe" } ],
    H: [ { text: "House" }, { text: "Hat" }, { text: "Horse" }, { text: "Heart" } ],
    I: [ { text: "Ice Cream" }, { text: "Igloo" }, { text: "Island" }, { text: "Ice" } ],
    J: [ { text: "Jeans" }, { text: "Juice" }, { text: "Jellyfish" }, { text: "Jacket" } ],
    K: [ { text: "Key" }, { text: "Kite" }, { text: "Kangaroo" }, { text: "Keyboard" } ],
    L: [ { text: "Lion" }, { text: "Leaf" }, { text: "Lemon" }, { text: "Lamp" } ],
    M: [ { text: "Moon" }, { text: "Monkey" }, { text: "Mouse" }, { text: "Mushroom" } ],
    N: [ { text: "Notebook" }, { text: "Nest" }, { text: "Nose" }, { text: "Nut" } ],
    O: [ { text: "Owl" }, { text: "Orange" }, { text: "Octopus" }, { text: "Ocean" } ],
    P: [ { text: "Penguin" }, { text: "Pig" }, { text: "Pizza" }, { text: "Panda" } ],
    Q: [ { text: "Queen" }, { text: "Quilt" }, { text: "Question" }, { text: "Quarter" } ],
    R: [ { text: "Rain" }, { text: "Rocket" }, { text: "Rabbit" }, { text: "Robot" } ],
    S: [ { text: "Sun" }, { text: "Star" }, { text: "Snow" }, { text: "Snake" } ],
    T: [ { text: "Tree" }, { text: "Tiger" }, { text: "Train" }, { text: "Turtle" } ],
    U: [ { text: "Umbrella" }, { text: "Unicorn" }, { text: "UFO" }, { text: "Uniform" } ],
    V: [ { text: "Violin" }, { text: "Volcano" }, { text: "Vase" }, { text: "Vampire" } ],
    W: [ { text: "Watermelon" }, { text: "Whale" }, { text: "Watch" }, { text: "Window" } ],
    X: [ { text: "X-Ray" }, { text: "Xylophone" }, { text: "Xmas Tree" }, { text: "Xenops" } ],
    Y: [ { text: "Yo-Yo" }, { text: "Yacht" }, { text: "Yarn" }, { text: "Yellow" } ],
    Z: [ { text: "Zebra" }, { text: "Zoo" }, { text: "Zombie" }, { text: "Zipper" } ],
};

function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function generateLevels(numLevels = 50) {
    const generatedLevels = [];
    const allItems = [];
    for (const letter in alphabetData) {
        alphabetData[letter].forEach(item => allItems.push(item));
    }
    
    let deck = shuffle([...allItems]);

    for (let i = 0; i < numLevels; i++) {
        const levelNum = i + 1;
        const itemCount = Math.min(4 + i, 12);
        
        const words = [];
        
        for (let j = 0; j < itemCount; j++) {
            if (deck.length === 0) {
                deck = shuffle([...allItems]);
            }
            const itemData = deck.pop();
            words.push(itemData.text);
        }
        
        generatedLevels.push({
            level: levelNum,
            words
        });
    }
    
    return generatedLevels;
}

const levels = generateLevels();
console.log("Level 1:", levels[0].words);
console.log("Level 11:", levels[10].words);
console.log("Level 12:", levels[11].words);
