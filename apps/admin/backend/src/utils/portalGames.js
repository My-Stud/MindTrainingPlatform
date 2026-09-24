/**
 * Complete list of all 47+ games in the GAG Mind Training Portal
 * Pre-configured with proper slugs, types, and starter question banks.
 */

const PORTAL_GAMES = [
  {
    name: "Trivia Smash",
    slug: "trivia-smash",
    projectType: "mcq",
    fieldLabelField1: "Question",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "Which planet is known as the Red Planet?", optionA: "Venus", optionB: "Mars", optionC: "Jupiter", optionD: "Saturn", correctAnswer: "B", difficulty: "easy", category: "Astronomy", hint: "It is the 4th planet from the Sun." },
      { field1: "What is the capital of Australia?", optionA: "Sydney", optionB: "Melbourne", optionC: "Canberra", optionD: "Brisbane", correctAnswer: "C", difficulty: "medium", category: "Geography", hint: "It was purpose-built as the federal capital." },
      { field1: "Who painted the Mona Lisa?", optionA: "Vincent van Gogh", optionB: "Leonardo da Vinci", optionC: "Pablo Picasso", optionD: "Claude Monet", correctAnswer: "B", difficulty: "easy", category: "Art", hint: "Famous Italian polymath of the Renaissance." },
      { field1: "What is the chemical symbol for Gold?", optionA: "Ag", optionB: "Au", optionC: "Fe", optionD: "Pb", correctAnswer: "B", difficulty: "easy", category: "Science", hint: "From the Latin word Aurum." },
      { field1: "Which country hosted the 2024 Summer Olympics?", optionA: "Japan", optionB: "USA", optionC: "France", optionD: "UK", correctAnswer: "C", difficulty: "easy", category: "Sports", hint: "City of Light." }
    ]
  },
  {
    name: "Country Shooter",
    slug: "country-shooter",
    projectType: "mcq",
    fieldLabelField1: "Question",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "Which country is home to the Eiffel Tower?", optionA: "Germany", optionB: "France", optionC: "Italy", optionD: "Spain", correctAnswer: "B", difficulty: "easy", category: "Landmarks" },
      { field1: "What is the largest country by land area?", optionA: "Canada", optionB: "China", optionC: "Russia", optionD: "USA", correctAnswer: "C", difficulty: "easy", category: "Geography" },
      { field1: "Which nation is known as the Land of the Rising Sun?", optionA: "South Korea", optionB: "Japan", optionC: "Thailand", optionD: "China", correctAnswer: "B", difficulty: "easy", category: "Culture" }
    ]
  },
  {
    name: "Bubble Pop Safari",
    slug: "bubble-pop-safari",
    projectType: "mcq",
    fieldLabelField1: "Animal / Clue",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "Which is the fastest land animal in the world?", optionA: "Cheetah", optionB: "Lion", optionC: "Leopard", optionD: "Gazelle", correctAnswer: "A", difficulty: "easy", category: "Wildlife" },
      { field1: "Which marine animal is the largest mammal on Earth?", optionA: "Blue Whale", optionB: "Orca", optionC: "Humpback Whale", optionD: "Giant Squid", correctAnswer: "A", difficulty: "easy", category: "Marine" },
      { field1: "How many hearts does an octopus have?", optionA: "1", optionB: "2", optionC: "3", optionD: "4", correctAnswer: "C", difficulty: "medium", category: "Biology" }
    ]
  },
  {
    name: "Country Symbol Matcher",
    slug: "country-symbol-matcher",
    projectType: "mcq",
    fieldLabelField1: "Symbol Challenge",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "Which animal is the national symbol of India?", optionA: "Elephant", optionB: "Royal Bengal Tiger", optionC: "Lion", optionD: "Peacock", correctAnswer: "B", difficulty: "easy", category: "National Symbols" },
      { field1: "The Maple Leaf is the national emblem of which country?", optionA: "Canada", optionB: "Norway", optionC: "Finland", optionD: "Sweden", correctAnswer: "A", difficulty: "easy", category: "National Symbols" }
    ]
  },
  {
    name: "Global Genius",
    slug: "global-genius",
    projectType: "mcq",
    fieldLabelField1: "Genius Quiz",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "What is the hardest natural substance on Earth?", optionA: "Diamond", optionB: "Titanium", optionC: "Quartz", optionD: "Graphene", correctAnswer: "A", difficulty: "easy", category: "Science" },
      { field1: "Who developed the theory of relativity?", optionA: "Isaac Newton", optionB: "Albert Einstein", optionC: "Galileo Galilei", optionD: "Nikola Tesla", correctAnswer: "B", difficulty: "easy", category: "Physics" }
    ]
  },
  {
    name: "Parliament Master",
    slug: "parliament-master",
    projectType: "mcq",
    fieldLabelField1: "Parliament / Civics Question",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "What is the lower house of the Indian Parliament called?", optionA: "Rajya Sabha", optionB: "Lok Sabha", optionC: "Vidhan Sabha", optionD: "Gram Sabha", correctAnswer: "B", difficulty: "easy", category: "Polity" },
      { field1: "What is the US legislative branch called?", optionA: "Parliament", optionB: "Congress", optionC: "Diet", optionD: "Bundestag", correctAnswer: "B", difficulty: "easy", category: "World Governments" }
    ]
  },
  {
    name: "River Country Game",
    slug: "river-country-game",
    projectType: "mcq",
    fieldLabelField1: "River Clue",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "Which is the longest river in the world?", optionA: "Amazon River", optionB: "Nile River", optionC: "Yangtze River", optionD: "Mississippi River", correctAnswer: "B", difficulty: "easy", category: "Rivers" },
      { field1: "Through which city does the River Thames flow?", optionA: "Paris", optionB: "London", optionC: "Rome", optionD: "Berlin", correctAnswer: "B", difficulty: "easy", category: "Rivers" }
    ]
  },
  {
    name: "Seven Wonders",
    slug: "seven-wonders",
    projectType: "mcq",
    fieldLabelField1: "Heritage Clue",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "In which country is the Taj Mahal located?", optionA: "India", optionB: "Pakistan", optionC: "Bangladesh", optionD: "Iran", correctAnswer: "A", difficulty: "easy", category: "Wonders" },
      { field1: "Machu Picchu is an ancient Inca citadel located in which country?", optionA: "Chile", optionB: "Peru", optionC: "Brazil", optionD: "Mexico", correctAnswer: "B", difficulty: "easy", category: "Wonders" }
    ]
  },
  {
    name: "State Capital Shooter",
    slug: "state-capital-shooter",
    projectType: "mcq",
    fieldLabelField1: "State / Capital Question",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "What is the capital of Maharashtra?", optionA: "Pune", optionB: "Mumbai", optionC: "Nagpur", optionD: "Nashik", correctAnswer: "B", difficulty: "easy", category: "States" },
      { field1: "What is the capital of California?", optionA: "Los Angeles", optionB: "San Francisco", optionC: "Sacramento", optionD: "San Diego", correctAnswer: "C", difficulty: "medium", category: "US Capitals" }
    ]
  },
  {
    name: "Institute Orbit",
    slug: "institute-orbit",
    projectType: "mcq",
    fieldLabelField1: "Institute / Discovery Question",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "Where is the headquarters of ISRO located?", optionA: "Bengaluru", optionB: "New Delhi", optionC: "Hyderabad", optionD: "Mumbai", correctAnswer: "A", difficulty: "easy", category: "Space & Science" },
      { field1: "Where is NASA Headquarters situated?", optionA: "Houston", optionB: "Washington, D.C.", optionC: "Cape Canaveral", optionD: "Pasadena", correctAnswer: "B", difficulty: "easy", category: "Space & Science" }
    ]
  },
  {
    name: "Speed Match",
    slug: "speed-match",
    projectType: "mcq",
    fieldLabelField1: "Speed Challenge",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "Does the current card match the previous card?", optionA: "Yes", optionB: "No", optionC: "Same Color", optionD: "Same Shape", correctAnswer: "A", difficulty: "easy", category: "Reaction" },
      { field1: "Compare the flashing symbol with 1-back memory.", optionA: "Match", optionB: "Mismatch", optionC: "Inverted", optionD: "Rotated", correctAnswer: "A", difficulty: "medium", category: "Cognitive" }
    ]
  },
  {
    name: "Memory Matrix",
    slug: "memory-matrix",
    projectType: "mcq",
    fieldLabelField1: "Pattern Question",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "How many tiles were highlighted in the 4x4 matrix?", optionA: "3", optionB: "4", optionC: "5", optionD: "6", correctAnswer: "C", difficulty: "easy", category: "Memory" }
    ]
  },
  {
    name: "Color Clash",
    slug: "color-clash",
    projectType: "mcq",
    fieldLabelField1: "Stroop Word",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "What is the font color of the word 'BLUE' written in Red ink?", optionA: "Blue", optionB: "Red", optionC: "Green", optionD: "Yellow", correctAnswer: "B", difficulty: "easy", category: "Focus" }
    ]
  },
  {
    name: "Daily Brain Teaser",
    slug: "daily-teaser",
    projectType: "mcq",
    fieldLabelField1: "Riddle",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "What has to be broken before you can use it?", optionA: "A Glass", optionB: "An Egg", optionC: "A Secret", optionD: "A Code", correctAnswer: "B", difficulty: "easy", category: "Riddles" }
    ]
  },
  {
    name: "Egg Toss",
    slug: "egg-catcher",
    projectType: "mcq",
    fieldLabelField1: "Target Clue",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "Which angle gives the maximum range in projectile motion?", optionA: "30°", optionB: "45°", optionC: "60°", optionD: "90°", correctAnswer: "B", difficulty: "medium", category: "Physics" }
    ]
  },
  {
    name: "Monkey Fruit Drop",
    slug: "monkey-fruit-drop",
    projectType: "mcq",
    fieldLabelField1: "Fruit Challenge",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "Which fruit is known as the King of Fruits?", optionA: "Mango", optionB: "Durian", optionC: "Apple", optionD: "Banana", correctAnswer: "A", difficulty: "easy", category: "Botany" }
    ]
  },
  {
    name: "Sudoku",
    slug: "sudoku",
    projectType: "classic",
    fieldLabelField1: "Difficulty",
    fieldLabelField2: "Puzzle Clue",
    fieldLabelField3: "Solution Hint",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "Classic 9x9", field2: "Fill each row, column, and 3x3 box with numbers 1 to 9.", field3: "Look for rows with single missing values first." }
    ]
  },
  {
    name: "Math Puzzle",
    slug: "math-puzzle",
    projectType: "mcq",
    fieldLabelField1: "Math Problem",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "What is 15 * 12?", optionA: "170", optionB: "180", optionC: "190", optionD: "160", correctAnswer: "B", difficulty: "easy", category: "Arithmetic" },
      { field1: "What is the square root of 144?", optionA: "11", optionB: "12", optionC: "14", optionD: "16", correctAnswer: "B", difficulty: "easy", category: "Algebra" }
    ]
  },
  {
    name: "Loop Game",
    slug: "loop-game",
    projectType: "mcq",
    fieldLabelField1: "Loop Puzzle",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "Which rotation connects the loop without crossings?", optionA: "90° Clockwise", optionB: "180°", optionC: "270°", optionD: "No change", correctAnswer: "A", difficulty: "medium", category: "Spatial" }
    ]
  },
  {
    name: "Find The Room",
    slug: "find-room",
    projectType: "mcq",
    fieldLabelField1: "Room Navigation Clue",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "Where do students perform science experiments with beakers?", optionA: "Computer Lab", optionB: "Chemistry Lab", optionC: "Library", optionD: "Canteen", correctAnswer: "B", difficulty: "easy", category: "School Nav" }
    ]
  },
  {
    name: "Mystery Pointer",
    slug: "mystery-pointer",
    projectType: "mcq",
    fieldLabelField1: "Observation Clue",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "Which object was hidden behind the curtain in the staff room?", optionA: "Globe", optionB: "Microscope", optionC: "Trophy", optionD: "Clock", correctAnswer: "A", difficulty: "easy", category: "Observation" }
    ]
  },
  {
    name: "Train Tracker",
    slug: "train-game",
    projectType: "mcq",
    fieldLabelField1: "Track Problem",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "If Train A travels at 60 km/h and Train B at 80 km/h towards each other from 140 km apart, when do they meet?", optionA: "30 mins", optionB: "1 hour", optionC: "1.5 hours", optionD: "2 hours", correctAnswer: "B", difficulty: "medium", category: "Speed & Distance" }
    ]
  },
  {
    name: "Word 2 Picture",
    slug: "word-2-picture",
    projectType: "classic",
    fieldLabelField1: "Word",
    fieldLabelField2: "Picture / Category",
    fieldLabelField3: "Hint",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "Telescope", field2: "Astronomy", field3: "Used to see distant stars" },
      { field1: "Microscope", field2: "Biology", field3: "Used to view tiny cells" },
      { field1: "Compass", field2: "Navigation", field3: "Points north" }
    ]
  },
  {
    name: "Word Formation",
    slug: "word-formation",
    projectType: "classic",
    fieldLabelField1: "Root Word",
    fieldLabelField2: "Prefix / Suffix",
    fieldLabelField3: "Result",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "Happy", field2: "Un-", field3: "Unhappy" },
      { field1: "Care", field2: "-ful", field3: "Careful" }
    ]
  },
  {
    name: "Word Puzzle",
    slug: "word-puzzle",
    projectType: "classic",
    fieldLabelField1: "Clue",
    fieldLabelField2: "Answer",
    fieldLabelField3: "Category",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "The study of living organisms", field2: "Biology", field3: "Science" },
      { field1: "A polygon with eight sides", field2: "Octagon", field3: "Geometry" }
    ]
  },
  {
    name: "Word Cave",
    slug: "word-canve",
    projectType: "classic",
    fieldLabelField1: "Cave Clue",
    fieldLabelField2: "Target Word",
    fieldLabelField3: "Hint",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "Stalactite formation zone", field2: "Cave", field3: "Hanging from the ceiling" }
    ]
  },
  {
    name: "Cricket World Cup Quiz",
    slug: "cricket",
    projectType: "mcq",
    fieldLabelField1: "Question",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "Who won the first ICC Cricket World Cup in 1975?", optionA: "Australia", optionB: "West Indies", optionC: "England", optionD: "India", correctAnswer: "B", difficulty: "medium", category: "World Cup" },
      { field1: "Who has scored the highest individual score in ODI cricket?", optionA: "Rohit Sharma", optionB: "Sachin Tendulkar", optionC: "Martin Guptill", optionD: "Virender Sehwag", correctAnswer: "A", difficulty: "easy", category: "Records", hint: "264 runs against Sri Lanka" }
    ]
  },
  {
    name: "Wonder Assembly Hall",
    slug: "wonder-assembly-hall",
    projectType: "mcq",
    fieldLabelField1: "Assembly Challenge",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "What is the primary purpose of a school assembly hall?", optionA: "Physical Education", optionB: "Gatherings & Cultural Events", optionC: "Cooking", optionD: "Experiments", correctAnswer: "B", difficulty: "easy", category: "School Life" }
    ]
  },
  {
    name: "Wonder Bathroom",
    slug: "wonder-bath-room",
    projectType: "mcq",
    fieldLabelField1: "Hygiene Clue",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "How long should you scrub your hands with soap to kill germs?", optionA: "5 seconds", optionB: "20 seconds", optionC: "2 minutes", optionD: "10 seconds", correctAnswer: "B", difficulty: "easy", category: "Health & Hygiene" }
    ]
  },
  {
    name: "Wonder Bedroom",
    slug: "wonder-bed-room",
    projectType: "mcq",
    fieldLabelField1: "Sleep Science Question",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "What hormone regulates the human sleep-wake cycle?", optionA: "Dopamine", optionB: "Melatonin", optionC: "Adrenaline", optionD: "Insulin", correctAnswer: "B", difficulty: "medium", category: "Human Body" }
    ]
  },
  {
    name: "Wonder Canteen",
    slug: "wonder-canteen",
    projectType: "mcq",
    fieldLabelField1: "Nutrition Question",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "Which vitamin is synthesized by the human body when exposed to sunlight?", optionA: "Vitamin A", optionB: "Vitamin C", optionC: "Vitamin D", optionD: "Vitamin B12", correctAnswer: "C", difficulty: "easy", category: "Nutrition" }
    ]
  },
  {
    name: "Wonder Classroom",
    slug: "wonder-classroom",
    projectType: "mcq",
    fieldLabelField1: "Classroom Science",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "What gas do plants absorb during photosynthesis?", optionA: "Oxygen", optionB: "Carbon Dioxide", optionC: "Nitrogen", optionD: "Hydrogen", correctAnswer: "B", difficulty: "easy", category: "Biology" }
    ]
  },
  {
    name: "Wonder Computer Lab",
    slug: "wonder-computer-lab",
    projectType: "mcq",
    fieldLabelField1: "Tech Challenge",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "What does 'CPU' stand for in computer systems?", optionA: "Central Processing Unit", optionB: "Central Power Unit", optionC: "Core Program Unit", optionD: "Control Panel Utility", correctAnswer: "A", difficulty: "easy", category: "Computers" }
    ]
  },
  {
    name: "Wonder Garden",
    slug: "wonder-garden",
    projectType: "mcq",
    fieldLabelField1: "Botanical Clue",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "What green pigment gives plants their color and absorbs sunlight?", optionA: "Chlorophyll", optionB: "Carotenoid", optionC: "Hemoglobin", optionD: "Melanin", correctAnswer: "A", difficulty: "easy", category: "Botany" }
    ]
  },
  {
    name: "Wonder Kitchen",
    slug: "wonder-kitchen",
    projectType: "mcq",
    fieldLabelField1: "Culinary Science",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "What is the chemical name of common table salt?", optionA: "Sodium Carbonate", optionB: "Sodium Chloride", optionC: "Potassium Nitrate", optionD: "Calcium Chloride", correctAnswer: "B", difficulty: "easy", category: "Chemistry" }
    ]
  },
  {
    name: "Wonder Chemistry Lab",
    slug: "wonder-lab-chem",
    projectType: "mcq",
    fieldLabelField1: "Chemistry Lab Clue",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "What is the pH level of pure distilled water?", optionA: "0", optionB: "7", optionC: "14", optionD: "5", correctAnswer: "B", difficulty: "easy", category: "Chemistry" }
    ]
  },
  {
    name: "Wonder Lawn",
    slug: "wonder-lawn",
    projectType: "mcq",
    fieldLabelField1: "Ecology Question",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "Which organism is known as nature's plowman that aerates garden soil?", optionA: "Caterpillar", optionB: "Earthworm", optionC: "Ant", optionD: "Beetle", correctAnswer: "B", difficulty: "easy", category: "Ecology" }
    ]
  },
  {
    name: "Wonder Library",
    slug: "wonder-library",
    projectType: "mcq",
    fieldLabelField1: "Literature Clue",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "Who is the author of 'Romeo and Juliet'?", optionA: "Charles Dickens", optionB: "William Shakespeare", optionC: "Mark Twain", optionD: "Jane Austen", correctAnswer: "B", difficulty: "easy", category: "Literature" }
    ]
  },
  {
    name: "Wonder Playground",
    slug: "wonder-play-ground",
    projectType: "mcq",
    fieldLabelField1: "Sports Science",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "How many players are on the field in a standard cricket team?", optionA: "9", optionB: "10", optionC: "11", optionD: "12", correctAnswer: "C", difficulty: "easy", category: "Sports" }
    ]
  },
  {
    name: "Wonder Principal Office",
    slug: "wonder-principal-room",
    projectType: "mcq",
    fieldLabelField1: "Leadership Question",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "What quality is most vital for effective school leadership?", optionA: "Rigidity", optionB: "Vision & Empathy", optionC: "Isolation", optionD: "Silence", correctAnswer: "B", difficulty: "easy", category: "Leadership" }
    ]
  },
  {
    name: "Wonder School Bus",
    slug: "wonder-school-bus",
    projectType: "mcq",
    fieldLabelField1: "Road Safety Clue",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "Why are school buses typically painted bright yellow?", optionA: "Cheapest color", optionB: "Highest lateral peripheral visibility", optionC: "Historical tradition only", optionD: "Reflects heat", correctAnswer: "B", difficulty: "medium", category: "Safety" }
    ]
  },
  {
    name: "Wonder School Restroom",
    slug: "wonder-school-toilet",
    projectType: "mcq",
    fieldLabelField1: "Sanitation Question",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "What is the most effective way to prevent waterborne diseases?", optionA: "Proper handwashing & sanitation", optionB: "Drinking cold water", optionC: "Avoiding salt", optionD: "Exercising daily", correctAnswer: "A", difficulty: "easy", category: "Public Health" }
    ]
  },
  {
    name: "Wonder Infirmary",
    slug: "wonder-sick-room",
    projectType: "mcq",
    fieldLabelField1: "First Aid Clue",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "What is the first step in treating a minor burn?", optionA: "Apply ice directly", optionB: "Cool running water for 10-15 minutes", optionC: "Apply butter", optionD: "Cover tightly with tape", correctAnswer: "B", difficulty: "easy", category: "First Aid" }
    ]
  },
  {
    name: "Wonder Staff Room",
    slug: "wonder-staff-room",
    projectType: "mcq",
    fieldLabelField1: "Pedagogy Challenge",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "What is formative assessment primarily designed to do?", optionA: "Assign final grades", optionB: "Monitor learning and provide ongoing feedback", optionC: "Rank institutions", optionD: "Conduct inspections", correctAnswer: "B", difficulty: "medium", category: "Education" }
    ]
  },
  {
    name: "Wonder 1 Assembly Hall",
    slug: "wonder1-assembly-hall",
    projectType: "mcq",
    fieldLabelField1: "Assembly Challenge 2",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "What acoustic property prevents echoes in large halls?", optionA: "Hard marble floors", optionB: "Sound-absorbing acoustic panels", optionC: "Large bare walls", optionD: "Metal ceilings", correctAnswer: "B", difficulty: "medium", category: "Acoustics" }
    ]
  },
  {
    name: "Wonder 1 Playground",
    slug: "wonder1-play-ground",
    projectType: "mcq",
    fieldLabelField1: "Athletics Question",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "What is the standard distance of an Olympic running track lane 1?", optionA: "200m", optionB: "400m", optionC: "500m", optionD: "800m", correctAnswer: "B", difficulty: "easy", category: "Athletics" }
    ]
  },
  {
    name: "Wonder 1 Principal Office",
    slug: "wonder1-principal-room",
    projectType: "mcq",
    fieldLabelField1: "Administration Clue",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "What document sets the formal rules and standards for an academic curriculum?", optionA: "Syllabus / Curriculum Framework", optionB: "Attendance register", optionC: "Receipt book", optionD: "Floor plan", correctAnswer: "A", difficulty: "easy", category: "Education" }
    ]
  },
  {
    name: "Wonder 1 School Bus",
    slug: "wonder1-school-bus",
    projectType: "mcq",
    fieldLabelField1: "Transport Safety",
    questionsPerQuiz: 15,
    sampleQuestions: [
      { field1: "What device on vehicles helps record speed and driving time?", optionA: "Altimeter", optionB: "Tachograph / GPS Tracker", optionC: "Barometer", optionD: "Galvanometer", correctAnswer: "B", difficulty: "medium", category: "Transport" }
    ]
  },
  {
    name: "Cactiquiz",
    slug: "cactiquiz",
    projectType: "mcq",
    fieldLabelField1: "Question",
    questionsPerQuiz: 15,
  },
  {
    name: "City Runner",
    slug: "city-runner",
    projectType: "mcq",
    fieldLabelField1: "Question",
    questionsPerQuiz: 15,
  },
  {
    name: "Platformer",
    slug: "platformer",
    projectType: "mcq",
    fieldLabelField1: "Question",
    questionsPerQuiz: 15,
  },
  {
    name: "Tactical Sniper",
    slug: "tactical-sniper",
    projectType: "mcq",
    fieldLabelField1: "Question",
    questionsPerQuiz: 15,
  },
  {
    name: "Tanker",
    slug: "tanker",
    projectType: "mcq",
    fieldLabelField1: "Question",
    questionsPerQuiz: 15,
  },
  {
    name: "Vocabullseye",
    slug: "vocabullseye",
    projectType: "mcq",
    fieldLabelField1: "Question",
    questionsPerQuiz: 15,
  },
  {
    name: "Helicopter Trivia",
    slug: "helicopter-trivia",
    projectType: "mcq",
    fieldLabelField1: "Question",
    questionsPerQuiz: 15,
  },
  {
    name: "Vocabkicker",
    slug: "vocabkicker",
    projectType: "mcq",
    fieldLabelField1: "Question",
    questionsPerQuiz: 15,
  }
];

module.exports = { PORTAL_GAMES };
