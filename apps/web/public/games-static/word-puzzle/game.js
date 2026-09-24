// === WordQuest Adventure - Game Engine ===

const ALL_LEVELS = [
  // BEGINNER (1-20)
  {id:1,word:"BOOK",cat:"School",hint:"You read this to learn new things",meaning:"A written or printed work of pages.",example:"I love to read a good book before bed.",fact:"The longest book ever written is over 4 million words!",pron:"/bʊk/",pos:"Noun"},
  {id:2,word:"STAR",cat:"Nature",hint:"It twinkles in the night sky",meaning:"A luminous point of light in the night sky.",example:"We wished upon a bright star last night.",fact:"The sun is actually a star!",pron:"/stɑːr/",pos:"Noun"},
  {id:3,word:"GAME",cat:"Fun",hint:"Something fun you play with friends",meaning:"An activity for entertainment or competition.",example:"Let's play a game after school!",fact:"The oldest known game is over 5,000 years old!",pron:"/ɡeɪm/",pos:"Noun"},
  {id:4,word:"TREE",cat:"Nature",hint:"It has leaves and gives us shade",meaning:"A tall plant with a trunk, branches, and leaves.",example:"The old tree in our yard is over 100 years old.",fact:"Some trees can live for thousands of years!",pron:"/triː/",pos:"Noun"},
  {id:5,word:"MILK",cat:"Food",hint:"A white drink from cows",meaning:"A white liquid produced by mammals for feeding young.",example:"I like to drink milk with my breakfast.",fact:"Humans are the only animals that drink milk from other animals!",pron:"/mɪlk/",pos:"Noun"},
  {id:6,word:"HAND",cat:"Body",hint:"You have five of these on your arms",meaning:"The end part of the arm with fingers.",example:"Please wash your hands before eating.",fact:"Your fingerprints are completely unique to you!",pron:"/hænd/",pos:"Noun"},
  {id:7,word:"FISH",cat:"Animals",hint:"It swims in water",meaning:"An animal that lives in water and has gills.",example:"We saw a colorful fish at the aquarium.",fact:"There are over 30,000 different species of fish!",pron:"/fɪʃ/",pos:"Noun"},
  {id:8,word:"BIRD",cat:"Animals",hint:"It has feathers and can fly",meaning:"A warm-blooded animal with feathers and wings.",example:"A little bird sat on my windowsill this morning.",fact:"Hummingbirds can fly backwards!",pron:"/bɜːrd/",pos:"Noun"},
  {id:9,word:"MOON",cat:"Nature",hint:"It shines in the night sky",meaning:"The natural satellite that orbits Earth.",example:"The moon looks beautiful tonight.",fact:"The moon is about 238,900 miles from Earth!",pron:"/muːn/",pos:"Noun"},
  {id:10,word:"RAIN",cat:"Weather",hint:"Water that falls from clouds",meaning:"Water falling from clouds in drops.",example:"We need rain to help the plants grow.",fact:"A single raindrop falls at about 14 mph!",pron:"/reɪn/",pos:"Noun",special:"coin"},
  {id:11,word:"SUN",cat:"Nature",hint:"It gives us light and warmth",meaning:"The star at the center of our solar system.",example:"The sun rose over the mountains this morning.",fact:"The sun is actually a medium-sized star!",pron:"/sʌn/",pos:"Noun"},
  {id:12,word:"CAT",cat:"Animals",hint:"A small furry pet that says meow",meaning:"A small domesticated carnivorous mammal.",example:"My cat loves to play with yarn.",fact:"Cats spend 70% of their lives sleeping!",pron:"/kæt/",pos:"Noun"},
  {id:13,word:"DOG",cat:"Animals",hint:"A loyal pet that barks",meaning:"A domesticated carnivorous mammal kept as a pet.",example:"The dog wagged its tail happily.",fact:"Dogs can learn over 1,000 words!",pron:"/dɒɡ/",pos:"Noun"},
  {id:14,word:"RED",cat:"Colors",hint:"The color of fire trucks",meaning:"A color at the end of the spectrum like blood.",example:"She wore a beautiful red dress.",fact:"Red is the most visible color from a distance!",pron:"/rɛd/",pos:"Adjective"},
  {id:15,word:"BLUE",cat:"Colors",hint:"The color of the ocean",meaning:"A color like the sky on a clear day.",example:"The sky is beautiful and blue today.",fact:"Blue is the world's most popular favorite color!",pron:"/bluː/",pos:"Adjective"},
  {id:16,word:"BALL",cat:"Sports",hint:"You kick or throw this to play",meaning:"A round object used in games and sports.",example:"The kids played with a ball at recess.",fact:"The oldest known ball is over 3,500 years old!",pron:"/bɔːl/",pos:"Noun"},
  {id:17,word:"CAKE",cat:"Food",hint:"A sweet dessert for birthdays",meaning:"A sweet baked food made with flour and sugar.",example:"Mom made a chocolate cake for my birthday.",fact:"The world's largest cake weighed over 81 tons!",pron:"/keɪk/",pos:"Noun"},
  {id:18,word:"HOME",cat:"Places",hint:"Where you live with your family",meaning:"A house or place where one lives.",example:"I love coming home after school.",fact:"The word 'home' comes from an old English word meaning 'village'!",pron:"/hoʊm/",pos:"Noun"},
  {id:19,word:"LOVE",cat:"Emotions",hint:"A strong feeling of caring",meaning:"A deep feeling of affection.",example:"I have so much love for my family.",fact:"The heart symbol has been used for over 500 years!",pron:"/lʌv/",pos:"Noun"},
  {id:20,word:"PLAY",cat:"Fun",hint:"What you do for fun after homework",meaning:"To engage in activity for enjoyment.",example:"Let's go outside and play!",fact:"Play is so important that it's a right of every child!",pron:"/pleɪ/",pos:"Verb"},
  // EASY (21-50)
  {id:21,word:"PLANT",cat:"Nature",hint:"It grows in soil and needs sunlight",meaning:"A living thing that grows in the ground.",example:"I water my plant every morning.",fact:"Some plants can communicate with each other!",pron:"/plænt/",pos:"Noun"},
  {id:22,word:"BEACH",cat:"Places",hint:"Sandy place next to the ocean",meaning:"A sandy or pebbly shore by the ocean.",example:"We built sandcastles at the beach.",fact:"The longest beach in the world is 150 miles long!",pron:"/biːtʃ/",pos:"Noun"},
  {id:23,word:"MUSIC",cat:"Arts",hint:"Sound that people make with instruments",meaning:"The art of organizing sound in time.",example:"I love listening to music while I study.",fact:"Playing music uses almost every part of your brain!",pron:"/ˈmjuːzɪk/",pos:"Noun"},
  {id:24,word:"APPLE",cat:"Food",hint:"A round red or green fruit",meaning:"A round fruit with red or green skin.",example:"An apple a day keeps the doctor away!",fact:"There are over 7,500 varieties of apples!",pron:"/ˈæpəl/",pos:"Noun"},
  {id:25,word:"TABLE",cat:"Furniture",hint:"You eat dinner on this",meaning:"A piece of furniture with a flat top.",example:"We set the table for dinner.",fact:"The first tables were used in ancient Egypt!",pron:"/ˈteɪbəl/",pos:"Noun"},
  {id:26,word:"CLOUD",cat:"Weather",hint:"It floats in the sky and brings rain",meaning:"A visible mass of water droplets in the sky.",example:"Look at that big fluffy cloud!",fact:"A single cloud can weigh over a million pounds!",pron:"/klaʊd/",pos:"Noun"},
  {id:27,word:"WATER",cat:"Nature",hint:"You drink this every day",meaning:"A clear liquid essential for life.",example:"Please get me a glass of water.",fact:"Water covers about 71% of Earth's surface!",pron:"/ˈwɔːtər/",pos:"Noun"},
  {id:28,word:"LIGHT",cat:"Science",hint:"What comes from the sun or a lamp",meaning:"The natural agent that makes things visible.",example:"Turn on the light so I can read.",fact:"Light travels at 186,000 miles per second!",pron:"/laɪt/",pos:"Noun"},
  {id:29,word:"HAPPY",cat:"Emotions",hint:"A feeling of joy and contentment",meaning:"Feeling or showing pleasure or contentment.",example:"I'm so happy to see you!",fact:"Being happy can actually make you healthier!",pron:"/ˈhæpi/",pos:"Adjective"},
  {id:30,word:"OCEAN",cat:"Nature",hint:"A very large body of salt water",meaning:"A very large expanse of salt water.",example:"The ocean is home to millions of species.",fact:"The ocean is so deep that 95% of it is unexplored!",pron:"/ˈoʊʃən/",pos:"Noun",special:"coin"},
  {id:31,word:"GREEN",cat:"Colors",hint:"The color of grass and leaves",meaning:"The color between blue and yellow.",example:"The grass looks so green after the rain.",fact:"Green is the easiest color for the human eye to see!",pron:"/ɡriːn/",pos:"Adjective"},
  {id:32,word:"CHAIR",cat:"Furniture",hint:"You sit on this",meaning:"A separate seat for one person.",example:"Please have a seat in this chair.",fact:"The oldest known chair is over 5,000 years old!",pron:"/tʃɛr/",pos:"Noun"},
  {id:33,word:"SLEEP",cat:"Actions",hint:"What you do at night in bed",meaning:"To rest in a state of natural unconsciousness.",example:"I need to sleep at least 8 hours every night.",fact:"Humans spend about one-third of their lives sleeping!",pron:"/sliːp/",pos:"Verb"},
  {id:34,word:"SMILE",cat:"Emotions",hint:"It shows you are happy",meaning:"To form one's features into a pleased expression.",example:"Your smile makes everyone happy.",fact:"Smiling can actually reduce stress!",pron:"/smaɪl/",pos:"Verb"},
  {id:35,word:"BRAIN",cat:"Body",hint:"This organ helps you think",meaning:"The organ inside the head that controls the body.",example:"Your brain is the most powerful computer!",fact:"The human brain has about 86 billion neurons!",pron:"/breɪn/",pos:"Noun"},
  {id:36,word:"EARTH",cat:"Geography",hint:"The planet we live on",meaning:"The planet on which we live.",example:"We should take care of our Earth.",fact:"Earth is the only planet not named after a god!",pron:"/ɜːrθ/",pos:"Noun"},
  {id:37,word:"DREAM",cat:"Emotions",hint:"Images you see when sleeping",meaning:"A series of images during sleep.",example:"I had a wonderful dream last night.",fact:"You forget about 95% of your dreams!",pron:"/driːm/",pos:"Noun"},
  {id:38,word:"SLIME",cat:"Fun",hint:"A fun stretchy toy kids play with",meaning:"A thick, slippery substance.",example:"The kids loved playing with green slime!",fact:"Slime has been popular since the 1970s!",pron:"/slaɪm/",pos:"Noun"},
  {id:39,word:"STONE",cat:"Nature",hint:"A small piece of rock",meaning:"A small piece of rock found on the ground.",example:"I found a smooth stone on the beach.",fact:"Some stones are older than the dinosaurs!",pron:"/stoʊn/",pos:"Noun"},
  {id:40,word:"WORLD",cat:"Geography",hint:"Our whole planet",meaning:"The earth, together with all its countries and peoples.",example:"The world is a beautiful place.",fact:"There are 195 countries in the world!",pron:"/wɜːrld/",pos:"Noun",special:"coin"},
  {id:41,word:"COLOR",cat:"Art",hint:"What makes things red, blue, or yellow",meaning:"The property of objects that produces different sensations.",example:"What color do you like best?",fact:"The human eye can see about 10 million colors!",pron:"/ˈkʌlər/",pos:"Noun"},
  {id:42,word:"FROST",cat:"Weather",hint:"Ice crystals on a cold morning",meaning:"Thin ice crystals on a cold surface.",example:"The grass was covered in frost this morning.",fact:"Frost can form even when the temperature is above freezing!",pron:"/frɔːst/",pos:"Noun"},
  {id:43,word:"BREAD",cat:"Food",hint:"A food made from flour and baked",meaning:"A food made from flour, water, and yeast.",example:"I like to eat fresh bread for breakfast.",fact:"Bread has been made for over 14,000 years!",pron:"/brɛd/",pos:"Noun"},
  {id:44,word:"GRAPE",cat:"Food",hint:"A small round fruit that grows in bunches",meaning:"A round fruit that grows in clusters on vines.",example:"These grapes are so sweet and juicy!",fact:"Grapes are grown on every continent except Antarctica!",pron:"/ɡreɪp/",pos:"Noun"},
  {id:45,word:"FLAME",cat:"Science",hint:"The bright part of fire",meaning:"A hot bright stream of burning gas.",example:"The candle flame flickered in the wind.",fact:"The hottest part of a flame is the blue part!",pron:"/fleɪm/",pos:"Noun"},
  {id:46,word:"GLOVE",cat:"Clothing",hint:"You wear this on your hand in winter",meaning:"A covering for the hand with separate fingers.",example:"I wear gloves when it's cold outside.",fact:"Gloves have been worn for over 3,000 years!",pron:"/ɡlʌv/",pos:"Noun"},
  {id:47,word:"NIGHT",cat:"Time",hint:"When it's dark outside",meaning:"The time of darkness between sunset and sunrise.",example:"The stars shine bright at night.",fact:"Nocturnal animals are most active at night!",pron:"/naɪt/",pos:"Noun"},
  {id:48,word:"DANCE",cat:"Actions",hint:"Moving your body to music",meaning:"To move rhythmically to music.",example:"I love to dance with my friends!",fact:"Dancing can improve your memory!",pron:"/dæns/",pos:"Verb"},
  {id:49,word:"PIANO",cat:"Music",hint:"A large musical instrument with keys",meaning:"A large musical instrument with black and white keys.",example:"She plays the piano beautifully.",fact:"A piano has 88 keys!",pron:"/piˈænoʊ/",pos:"Noun"},
  {id:50,word:"SUNNY",cat:"Weather",hint:"When the sky is bright with sunshine",meaning:"Bright with or giving out sunlight.",example:"It's a beautiful sunny day!",fact:"The sun is actually white, but appears yellow from Earth!",pron:"/ˈsʌni/",pos:"Adjective",special:"speed"},
  // INTERMEDIATE (51-100)
  {id:51,word:"TIGER",cat:"Animals",hint:"A big striped cat from Asia",meaning:"A large wild cat with orange and black stripes.",example:"The tiger is the largest cat in the world.",fact:"No two tigers have the same stripe pattern!",pron:"/ˈtaɪɡər/",pos:"Noun"},
  {id:52,word:"RIVER",cat:"Geography",hint:"A large natural stream of water",meaning:"A large natural stream of water flowing to the sea.",example:"We went fishing in the river.",fact:"The Nile River is the longest river in the world!",pron:"/ˈrɪvər/",pos:"Noun"},
  {id:53,word:"PENCIL",cat:"School",hint:"You write and draw with this",meaning:"A writing instrument with a graphite core.",example:"Can I borrow your pencil for the test?",fact:"One pencil can write about 45,000 words!",pron:"/ˈpɛnsəl/",pos:"Noun"},
  {id:54,word:"ROBOT",cat:"Technology",hint:"A machine that can do tasks automatically",meaning:"A machine capable of carrying out complex actions.",example:"The robot can walk and talk!",fact:"The word 'robot' comes from Czech meaning 'forced work'!",pron:"/ˈroʊbɒt/",pos:"Noun"},
  {id:55,word:"SOLAR",cat:"Science",hint:"Related to the sun",meaning:"Relating to or determined by the sun.",example:"We use solar panels to make electricity.",fact:"Solar energy is one of the cleanest forms of energy!",pron:"/ˈsoʊlər/",pos:"Adjective"},
  {id:56,word:"NORTH",cat:"Geography",hint:"One of the four directions",meaning:"The direction toward the pole opposite to south.",example:"We live in the northern part of the country.",fact:"The North Star has helped travelers for centuries!",pron:"/nɔːrθ/",pos:"Noun"},
  {id:57,word:"FRUIT",cat:"Food",hint:"Sweet food that grows on trees",meaning:"The sweet product of a plant that contains seeds.",example:"I love eating fresh fruit for breakfast.",fact:"There are over 2,000 types of fruit in the world!",pron:"/fruːt/",pos:"Noun"},
  {id:58,word:"SMART",cat:"Adjectives",hint:"Having or showing intelligence",meaning:"Having or showing a quick-witted intelligence.",example:"She is very smart and gets good grades.",fact:"The word 'smart' originally meant 'painful' in Old English!",pron:"/smɑːrt/",pos:"Adjective",special:"coin"},
  {id:59,word:"HONEY",cat:"Food",hint:"Sweet food made by bees",meaning:"A sweet sticky substance made by bees.",example:"I put honey in my tea every morning.",fact:"Honey never spoils - 3,000 year old honey was still good!",pron:"/ˈhʌni/",pos:"Noun"},
  {id:60,word:"EAGLE",cat:"Animals",hint:"A large bird of prey with sharp talons",meaning:"A large bird of prey with a hooked beak.",example:"The eagle soared high above the mountains.",fact:"Eagles can see fish from over a mile away!",pron:"/ˈiːɡəl/",pos:"Noun"},
  {id:61,word:"GHOST",cat:"Fantasy",hint:"A spirit of a dead person in stories",meaning:"An apparition of a dead person believed to appear.",example:"The old house is haunted by a ghost.",fact:"The word 'ghost' originally meant 'spirit' or 'soul'!",pron:"/ɡoʊst/",pos:"Noun"},
  {id:62,word:"HEART",cat:"Body",hint:"The organ that pumps blood",meaning:"A muscular organ that pumps blood through the body.",example:"My heart beats fast when I exercise.",fact:"Your heart beats about 100,000 times every day!",pron:"/hɑːrt/",pos:"Noun"},
  {id:63,word:"IMAGE",cat:"Art",hint:"A picture or visual representation",meaning:"A visual representation of something.",example:"I drew an image of my family.",fact:"The brain processes images 60,000 times faster than text!",pron:"/ˈɪmɪdʒ/",pos:"Noun"},
  {id:64,word:"JUICE",cat:"Food",hint:"A drink made from fruit",meaning:"A drink made from the liquid of fruit.",example:"I like to drink orange juice for breakfast.",fact:"Americans drink over 6 billion gallons of juice per year!",pron:"/dʒuːs/",pos:"Noun",special:"coin"},
  {id:65,word:"KNOCK",cat:"Actions",hint:"To hit a door to get attention",meaning:"To strike a surface with the knuckles.",example:"Please knock before you enter the room.",fact:"Knocking on wood is a centuries-old superstition!",pron:"/nɒk/",pos:"Verb"},
  {id:66,word:"LEMON",cat:"Food",hint:"A yellow citrus fruit that is sour",meaning:"A pale yellow oval citrus fruit.",example:"Add some lemon to make the tea taste better.",fact:"Lemons contain more sugar than strawberries!",pron:"/ˈlɛmən/",pos:"Noun"},
  {id:67,word:"MAGIC",cat:"Fantasy",hint:"Things that seem supernatural",meaning:"The power of influencing events using mysterious forces.",example:"The magician performed amazing magic tricks!",fact:"The word 'magic' comes from ancient Persian 'magi'!",pron:"/ˈmædʒɪk/",pos:"Noun"},
  {id:68,word:"OCEAN",cat:"Geography",hint:"The largest body of water on Earth",meaning:"A very large area of sea.",example:"The Pacific Ocean is the largest ocean.",fact:"More people have been to the moon than the ocean floor!",pron:"/ˈoʊʃən/",pos:"Noun"},
  {id:69,word:"QUEEN",cat:"People",hint:"A female ruler of a kingdom",meaning:"A female sovereign or monarch.",example:"The queen wore a beautiful golden crown.",fact:"Queen Elizabeth II was the longest-reigning British monarch!",pron:"/kwiːn/",pos:"Noun"},
  {id:70,word:"SPACE",cat:"Science",hint:"The area beyond Earth's atmosphere",meaning:"The area beyond Earth's atmosphere.",example:"Astronauts travel to space in rockets.",fact:"Space is completely silent because there's no air!",pron:"/speɪs/",pos:"Noun",special:"coin"},
  {id:71,word:"VOICE",cat:"Body",hint:"The sound you make when you speak",meaning:"The sound produced in the larynx.",example:"She has a beautiful singing voice.",fact:"The human voice can produce over 300 different sounds!",pron:"/vɔɪs/",pos:"Noun"},
  {id:72,word:"ZEBRA",cat:"Animals",hint:"A horse-like animal with stripes",meaning:"An African wild horse with black and white stripes.",example:"We saw zebras at the zoo today.",fact:"No two zebras have exactly the same stripe pattern!",pron:"/ˈziːbrə/",pos:"Noun"},
  {id:73,word:"CANDY",cat:"Food",hint:"A sweet treat for Halloween",meaning:"A confection made with sugar and flavoring.",example:"I love eating candy on Halloween!",fact:"Americans eat over 25 pounds of candy per person yearly!",pron:"/ˈkændi/",pos:"Noun"},
  {id:74,word:"FAITH",cat:"Values",hint:"Complete trust or confidence",meaning:"Complete trust or confidence in someone or something.",example:"I have faith that things will work out.",fact:"The word 'faith' comes from the Latin word for 'trust'!",pron:"/feɪθ/",pos:"Noun"},
  {id:75,word:"PRIDE",cat:"Emotions",hint:"A feeling of deep pleasure from achievements",meaning:"A feeling of deep pleasure from one's achievements.",example:"I feel pride in my schoolwork.",fact:"Lions are often called 'king of beasts' because of their pride!",pron:"/praɪd/",pos:"Noun",special:"coin"},
  {id:76,word:"BONUS",cat:"General",hint:"Something extra or additional",meaning:"Something extra given as a reward.",example:"You get a bonus for finishing early!",fact:"The word 'bonus' comes from Latin meaning 'good'!",pron:"/ˈboʊnəs/",pos:"Noun"},
  {id:77,word:"YOUTH",cat:"People",hint:"The period of being young",meaning:"The period between childhood and adulthood.",example:"Youth is a time of learning and discovery.",fact:"The brain continues developing until about age 25!",pron:"/juːθ/",pos:"Noun"},
  {id:78,word:"UNION",cat:"Social Studies",hint:"The act of joining together",meaning:"The act of joining together or uniting.",example:"The union of the teams created a stronger group.",fact:"The United States was formed by the union of 13 colonies!",pron:"/ˈjuːnjən/",pos:"Noun"},
  // ADVANCED (101-150)
  {id:79,word:"FOREST",cat:"Nature",hint:"A large area covered with trees",meaning:"A large area covered chiefly with trees.",example:"We went hiking through the forest.",fact:"Forests cover about 31% of Earth's land area!",pron:"/ˈfɔːrɪst/",pos:"Noun"},
  {id:80,word:"ORANGE",cat:"Food",hint:"A citrus fruit that is orange in color",meaning:"A round citrus fruit with bright orange skin.",example:"I peeled an orange for a healthy snack.",fact:"Orange trees can live for over 100 years!",pron:"/ˈɔːrɪndʒ/",pos:"Noun"},
  {id:81,word:"CASTLE",cat:"Places",hint:"A large building with towers and walls",meaning:"A large building fortified against attack.",example:"The castle was built over 800 years ago.",fact:"Some castles had secret passages and hidden rooms!",pron:"/ˈkæsəl/",pos:"Noun"},
  {id:82,word:"DRAGON",cat:"Fantasy",hint:"A mythical fire-breathing creature",meaning:"A mythical monster usually represented as fire-breathing.",example:"The dragon guarded the treasure in the cave.",fact:"Dragons appear in myths of cultures around the world!",pron:"/ˈdræɡən/",pos:"Noun"},
  {id:83,word:"FROZEN",cat:"Weather",hint:"Turned into ice",meaning:"Turned into ice; very cold.",example:"The lake was frozen solid in winter.",fact:"Water expands when it freezes, which is why pipes burst!",pron:"/ˈfroʊzən/",pos:"Adjective"},
  {id:84,word:"GOLDEN",cat:"Colors",hint:"The color of gold",meaning:"Having the color or luster of gold.",example:"The sunset painted the sky in golden colors.",fact:"Golden retrievers are one of the most popular dog breeds!",pron:"/ˈɡoʊldən/",pos:"Adjective"},
  {id:85,word:"KNIGHT",cat:"Fantasy",hint:"A medieval warrior in armor",meaning:"A man who served as a mounted soldier.",example:"The knight rode his horse into battle.",fact:"The 'k' in knight is silent - it was pronounced in Old English!",pron:"/naɪt/",pos:"Noun",special:"coin"},
  {id:86,word:"NEEDLE",cat:"Objects",hint:"A thin pointed tool for sewing",meaning:"A small thin piece of steel with a pointed end.",example:"Be careful with the needle when sewing.",fact:"The smallest needle is only 0.02mm wide!",pron:"/ˈniːdəl/",pos:"Noun"},
  {id:87,word:"PIRATE",cat:"Fantasy",hint:"A person who robs at sea",meaning:"A person who attacks and robs ships at sea.",example:"The pirate searched for buried treasure.",fact:"Pirates wore eye patches to help see below deck!",pron:"/ˈpaɪrət/",pos:"Noun"},
  {id:88,word:"RABBIT",cat:"Animals",hint:"A small furry animal with long ears",meaning:"A small mammal with long ears and a short tail.",example:"The rabbit hopped across the garden.",fact:"Rabbits can jump up to 3 feet high!",pron:"/ˈræbɪt/",pos:"Noun"},
  {id:89,word:"SILVER",cat:"Colors",hint:"A shiny gray color like the metal",meaning:"A shiny grayish-white metallic element.",example:"She wore a silver necklace.",fact:"Silver is the best conductor of electricity!",pron:"/ˈsɪlvər/",pos:"Noun"},
  {id:90,word:"TEMPLE",cat:"Places",hint:"A building devoted to worship",meaning:"A building devoted to the worship of a deity.",example:"The ancient temple was beautifully carved.",fact:"The oldest known temple is over 11,000 years old!",pron:"/ˈtɛmpəl/",pos:"Noun"},
  {id:91,word:"WIZARD",cat:"Fantasy",hint:"A person who practices magic",meaning:"A man who has magical powers.",example:"The wizard cast a spell to help the village.",fact:"The word 'wizard' originally meant 'wise man'!",pron:"/ˈwɪzərd/",pos:"Noun",special:"coin"},
  {id:92,word:"ISLAND",cat:"Geography",hint:"Land surrounded by water",meaning:"A piece of land surrounded by water.",example:"We took a boat to the tropical island.",fact:"There are over 100,000 islands in the world!",pron:"/ˈaɪlənd/",pos:"Noun"},
  {id:93,word:"BREEZE",cat:"Weather",hint:"A light gentle wind",meaning:"A light gentle wind.",example:"A cool breeze blew through the window.",fact:"A breeze is defined as wind moving at 4-27 mph!",pron:"/briːz/",pos:"Noun"},
  {id:94,word:"CARROT",cat:"Food",hint:"An orange vegetable that rabbits love",meaning:"A tapering orange root vegetable.",example:"I like to eat carrot sticks with hummus.",fact:"Carrots were originally purple, not orange!",pron:"/ˈkærət/",pos:"Noun"},
  {id:95,word:"DESERT",cat:"Geography",hint:"A dry barren area with little rainfall",meaning:"A barren area of land with little precipitation.",example:"The desert is hot during the day and cold at night.",fact:"The Sahara is almost as large as the United States!",pron:"/ˈdɛzərt/",pos:"Noun"},
  {id:96,word:"FLIGHT",cat:"Travel",hint:"The action of flying through the air",meaning:"The action or process of flying through the air.",example:"Our flight to Paris takes eight hours.",fact:"The first airplane flight lasted only 12 seconds!",pron:"/flaɪt/",pos:"Noun"},
  {id:97,word:"GARDEN",cat:"Nature",hint:"A place where plants and flowers grow",meaning:"A piece of ground for growing flowers or vegetables.",example:"My grandmother has a beautiful garden.",fact:"Gardening can reduce stress and improve mental health!",pron:"/ˈɡɑːrdən/",pos:"Noun"},
  {id:98,word:"INSECT",cat:"Animals",hint:"A small creature with six legs",meaning:"A small arthropod animal with six legs.",example:"I watched an insect crawl across the leaf.",fact:"There are about 10 quintillion insects alive at any time!",pron:"/ˈɪnsɛkt/",pos:"Noun"},
  {id:99,word:"JUNGLE",cat:"Nature",hint:"Dense tropical vegetation",meaning:"Land overgrown with dense forest.",example:"The jungle was full of exotic animals.",fact:"Jungles receive at least 60 inches of rain per year!",pron:"/ˈdʒʌŋɡəl/",pos:"Noun"},
  {id:100,word:"KITTEN",cat:"Animals",hint:"A young cat",meaning:"A young cat.",example:"The kitten played with a ball of yarn.",fact:"Kittens are born with blue eyes that change color!",pron:"/ˈkɪtən/",pos:"Noun",special:"boss"},
  // EXPERT (101-300) - representative sample
  {id:101,word:"JOURNEY",cat:"Travel",hint:"An act of traveling from one place to another",meaning:"An act of traveling from one place to another.",example:"The journey to the mountains was beautiful.",fact:"The longest journey walked was over 30,000 miles!",pron:"/ˈdʒɜːrni/",pos:"Noun"},
  {id:102,word:"SCIENCE",cat:"Education",hint:"The study of the natural world",meaning:"The systematic study of the natural world.",example:"I love learning about science in school.",fact:"The word 'science' comes from Latin 'scientia' meaning 'knowledge'!",pron:"/ˈsaɪəns/",pos:"Noun"},
  {id:103,word:"HISTORY",cat:"Education",hint:"The study of past events",meaning:"The study of past events.",example:"We learned about ancient history in class.",fact:"The oldest history book is over 2,500 years old!",pron:"/ˈhɪstəri/",pos:"Noun"},
  {id:104,word:"MOUNTAIN",cat:"Geography",hint:"A large natural elevation of Earth's surface",meaning:"A large natural elevation of the earth's surface.",example:"Mount Everest is the tallest mountain in the world.",fact:"Mountains cover about 22% of Earth's land!",pron:"/ˈmaʊntən/",pos:"Noun"},
  {id:105,word:"CAPTAIN",cat:"People",hint:"The leader of a team or ship",meaning:"The person in command of a ship or aircraft.",example:"The captain led the team to victory.",fact:"The word 'captain' comes from Latin for 'chief'!",pron:"/ˈkæptɪn/",pos:"Noun"},
  {id:106,word:"DOLPHIN",cat:"Animals",hint:"An intelligent marine mammal",meaning:"A gregarious toothed whale with an elongated beak.",example:"We saw dolphins jumping out of the water.",fact:"Dolphins sleep with one eye open!",pron:"/ˈdɒlfɪn/",pos:"Noun"},
  {id:107,word:"EXPLORE",cat:"Actions",hint:"To travel through unfamiliar areas",meaning:"To travel through unfamiliar areas to learn about them.",example:"We love to explore new places on vacation.",fact:"More people have been to the moon than the ocean floor!",pron:"/ɪkˈsplɔːr/",pos:"Verb"},
  {id:108,word:"FACTORY",cat:"Places",hint:"A building where goods are manufactured",meaning:"A building where goods are manufactured or assembled.",example:"The factory produces thousands of cars every month.",fact:"The first factory was established in England in the 1700s!",pron:"/ˈfæktəri/",pos:"Noun"},
  {id:109,word:"HORIZON",cat:"Nature",hint:"Where the earth and sky appear to meet",meaning:"The line at which the earth and sky appear to meet.",example:"The sun set below the horizon.",fact:"The horizon is always about 3 miles away!",pron:"/həˈraɪzən/",pos:"Noun",special:"coin"},
  {id:110,word:"IMAGINE",cat:"Actions",hint:"To form a mental image",meaning:"To form a mental image or concept.",example:"I can imagine a world full of possibilities.",fact:"Imagination is more powerful than knowledge - Einstein!",pron:"/ɪˈmædʒɪn/",pos:"Verb"},
  {id:111,word:"MAGNET",cat:"Science",hint:"An object that attracts iron",meaning:"An object that produces a magnetic field.",example:"The magnet picked up the paper clips.",fact:"Earth itself is a giant magnet!",pron:"/ˈmæɡnɪt/",pos:"Noun"},
  {id:112,word:"NEPTUNE",cat:"Science",hint:"The eighth planet from the sun",meaning:"The eighth planet from the sun.",example:"Neptune is the farthest planet from the sun.",fact:"Neptune has the strongest winds in the solar system!",pron:"/ˈnɛptjuːn/",pos:"Noun"},
  {id:113,word:"PENGUIN",cat:"Animals",hint:"A flightless bird from cold regions",meaning:"A flightless sea bird with black and white plumage.",example:"The penguin waddled across the ice.",fact:"Emperor penguins can dive to 1,800 feet!",pron:"/ˈpɛŋɡwɪn/",pos:"Noun"},
  {id:114,word:"RAINBOW",cat:"Nature",hint:"An arc of colors in the sky after rain",meaning:"An arch of colors formed in the sky by light refraction.",example:"We saw a beautiful rainbow after the storm.",fact:"You can never reach the end of a rainbow - it moves!",pron:"/ˈreɪnboʊ/",pos:"Noun"},
  {id:115,word:"SURVIVE",cat:"Actions",hint:"To continue to live or exist",meaning:"To continue to live or exist in spite of danger.",example:"Many animals survive in harsh climates.",fact:"Some animals can survive without food for months!",pron:"/sərˈvaɪv/",pos:"Verb"},
  {id:116,word:"VOLCANO",cat:"Geography",hint:"A mountain that can erupt with lava",meaning:"A mountain with a vent through which lava erupts.",example:"The volcano erupted and sent ash into the sky.",fact:"There are over 1,500 active volcanoes on Earth!",pron:"/vɒlˈkeɪnoʊ/",pos:"Noun"},
  {id:117,word:"WEATHER",cat:"Science",hint:"The state of the atmosphere",meaning:"The state of the atmosphere at a particular time.",example:"The weather is beautiful today.",fact:"Weather forecasts can only accurately predict about 10 days!",pron:"/ˈwɛðər/",pos:"Noun"},
  {id:118,word:"TROPHY",cat:"Sports",hint:"A prize given for winning",meaning:"A cup or other object given as a prize.",example:"The team won a trophy for first place.",fact:"The word 'trophy' comes from Greek meaning 'to defeat'!",pron:"/ˈtroʊfi/",pos:"Noun"},
  {id:119,word:"CRYSTAL",cat:"Science",hint:"A transparent mineral with regular structure",meaning:"A solid with atoms in a repeating pattern.",example:"The crystal sparkled in the light.",fact:"Diamonds are the hardest known natural crystal!",pron:"/ˈkrɪstəl/",pos:"Noun"},
  {id:120,word:"DYNASTY",cat:"History",hint:"A line of rulers from the same family",meaning:"A series of rulers from the same family.",example:"The Ming Dynasty ruled China for 300 years.",fact:"The longest ruling dynasty lasted over 1,500 years!",pron:"/ˈdaɪnəsti/",pos:"Noun",special:"coin"},
  {id:121,word:"ECLIPSE",cat:"Science",hint:"When one celestial body blocks another",meaning:"An obscuring of one celestial body by another.",example:"We watched the solar eclipse with special glasses.",fact:"During a total eclipse, the sky turns dark at midday!",pron:"/ɪˈklɪps/",pos:"Noun"},
  {id:122,word:"FRAGMENT",cat:"General",hint:"A small part broken off",meaning:"A small part broken or separated off something.",example:"We found a fragment of the ancient pottery.",fact:"Fragments of meteorites can be billions of years old!",pron:"/ˈfræɡmənt/",pos:"Noun"},
  {id:123,word:"GENETIC",cat:"Science",hint:"Relating to genes or heredity",meaning:"Relating to genes or heredity.",example:"Genetic testing can reveal ancestry info.",fact:"Humans share 99.9% of their DNA with each other!",pron:"/dʒəˈnɛtɪk/",pos:"Adjective"},
  {id:124,word:"HARMONY",cat:"Music",hint:"A pleasing arrangement of parts",meaning:"The combination of simultaneously sounded notes.",example:"The choir sang in perfect harmony.",fact:"Music harmony can actually reduce stress!",pron:"/ˈhɑːrməni/",pos:"Noun"},
  {id:125,word:"IMPROVE",cat:"Actions",hint:"To make or become better",meaning:"To make or become better.",example:"Practice every day to improve your skills.",fact:"The brain improves and grows stronger with learning!",pron:"/ɪmˈpruːv/",pos:"Verb",special:"coin"},
  {id:126,word:"MYSTERY",cat:"General",hint:"Something difficult to understand",meaning:"Something difficult or impossible to understand.",example:"The disappearance of the ship remains a mystery.",fact:"There are still many mysteries about the deep ocean!",pron:"/ˈmɪstəri/",pos:"Noun"},
  {id:127,word:"OBSERVE",cat:"Science",hint:"To watch carefully",meaning:"To watch carefully and attentively.",example:"Scientists observe animals to learn their behavior.",fact:"Observation is one of the most important scientific skills!",pron:"/əbˈzɜːrv/",pos:"Verb"},
  {id:128,word:"RESOLVE",cat:"Actions",hint:"To settle or find a solution",meaning:"To settle or find a solution to a problem.",example:"We need to resolve this issue quickly.",fact:"The word 'resolve' comes from Latin meaning 'to loosen'!",pron:"/rɪˈzɒlv/",pos:"Verb"},
  {id:129,word:"SOLSTICE",cat:"Science",hint:"When the sun reaches its highest or lowest point",meaning:"Each of the two times the sun is at greatest distance from equator.",example:"The summer solstice has the longest day.",fact:"Stonehenge was built to align with the solstice!",pron:"/ˈsɒlstɪs/",pos:"Noun"},
  {id:130,word:"ACCOMPLISH",cat:"Actions",hint:"To achieve successfully",meaning:"To achieve or complete successfully.",example:"I accomplished all my homework before dinner.",fact:"Accomplishing goals releases dopamine, making you happy!",pron:"/əˈkɒmplɪʃ/",pos:"Verb"},
  {id:131,word:"KNOWLEDGE",cat:"Education",hint:"Facts acquired through experience",meaning:"Facts, information, and skills acquired through experience.",example:"Knowledge is power!",fact:"The brain can store about 2.5 petabytes of information!",pron:"/ˈnɒlɪdʒ/",pos:"Noun"},
  {id:132,word:"LANGUAGE",cat:"Education",hint:"A system of communication",meaning:"The method of human communication using words.",example:"Learning a new language is exciting!",fact:"There are over 7,000 languages spoken in the world!",pron:"/ˈlæŋɡwɪdʒ/",pos:"Noun"},
  {id:133,word:"NUTRITION",cat:"Health",hint:"Food necessary for health",meaning:"The process of providing food for health and growth.",example:"Good nutrition is important for growing kids.",fact:"Your body needs over 40 different nutrients every day!",pron:"/njuːˈtrɪʃən/",pos:"Noun"},
  {id:134,word:"ORGANISM",cat:"Science",hint:"Any living thing",meaning:"An individual animal, plant, or life form.",example:"Bacteria are microscopic organisms.",fact:"More organisms live in a teaspoon of soil than people on Earth!",pron:"/ˈɔːɡənɪzəm/",pos:"Noun"},
  {id:135,word:"TECHNOLOGY",cat:"Technology",hint:"Application of scientific knowledge",meaning:"The application of scientific knowledge for practical purposes.",example:"Technology has changed how we communicate.",fact:"The first computer weighed over 27 tons!",pron:"/tɛkˈnɒlədʒi/",pos:"Noun"},
  {id:136,word:"VOLUNTEER",cat:"People",hint:"A person who helps without pay",meaning:"A person who offers to do something without being compelled.",example:"She volunteers at the animal shelter every weekend.",fact:"Volunteering can actually help you live longer!",pron:"/ˌvɒlənˈtɪər/",pos:"Noun"},
  {id:137,word:"WILDERNESS",cat:"Nature",hint:"An uncultivated region",meaning:"An uncultivated, uninhabited, inhospitable region.",example:"The wilderness is home to many wild animals.",fact:"About 46% of Earth's land is still wilderness!",pron:"/ˈwɪldərnəs/",pos:"Noun"},
  {id:138,word:"BIOGRAPHY",cat:"Education",hint:"An account of someone's life",meaning:"An account of someone's life written by someone else.",example:"I read a biography of Albert Einstein.",fact:"The word 'biography' comes from Greek 'life writing'!",pron:"/baɪˈɒɡrəfi/",pos:"Noun"},
  {id:139,word:"CONTINENT",cat:"Geography",hint:"One of Earth's main landmasses",meaning:"Any of the world's main continuous expanses of land.",example:"There are seven continents on Earth.",fact:"Asia covers about 30% of Earth's land!",pron:"/ˈkɒntɪnənt/",pos:"Noun"},
  {id:140,word:"CONQUER",cat:"Actions",hint:"To overcome or take control",meaning:"To overcome or take control of something.",example:"With determination, you can conquer any challenge!",fact:"True conquest comes from within!",pron:"/ˈkɒŋkər/",pos:"Verb",special:"boss"},
  {id:141,word:"ACHIEVE",cat:"Actions",hint:"To successfully reach a goal",meaning:"To successfully bring about or reach a goal.",example:"With hard work, you can achieve anything!",fact:"The word 'achieve' means 'to come to an end' in Latin!",pron:"/əˈtʃiːv/",pos:"Verb"},
  {id:142,word:"BALANCE",cat:"General",hint:"An even distribution of weight",meaning:"An even distribution of weight enabling stability.",example:"You need good balance to ride a bicycle.",fact:"Balance is maintained by your inner ear!",pron:"/ˈbæləns/",pos:"Noun"},
  {id:143,word:"CIRCUIT",cat:"Science",hint:"A path for electricity",meaning:"A path for transmitting electric current.",example:"The circuit powers the entire computer.",fact:"A circuit must be complete for electricity to flow!",pron:"/ˈsɜːrkɪt/",pos:"Noun"},
  {id:144,word:"CLIMATE",cat:"Science",hint:"Weather conditions over a long period",meaning:"The weather conditions prevailing over time.",example:"Climate change is an important issue.",fact:"Earth's climate has changed many times throughout history!",pron:"/ˈklaɪmət/",pos:"Noun"},
  {id:145,word:"ELEMENT",cat:"Science",hint:"A substance that cannot be broken down",meaning:"A substance that cannot be broken down further.",example:"Gold is a chemical element.",fact:"There are 118 known elements!",pron:"/ˈɛlɪmənt/",pos:"Noun"},
  {id:146,word:"FORMULA",cat:"Science",hint:"A mathematical relationship",meaning:"A mathematical relationship expressed in symbols.",example:"We used a formula to solve the problem.",fact:"The formula for water is H2O!",pron:"/ˈfɔːrmjələ/",pos:"Noun"},
  {id:147,word:"HONESTY",cat:"Values",hint:"The quality of being truthful",meaning:"The quality of being honest and truthful.",example:"Honesty is the best policy.",fact:"Studies show honest people tend to be happier!",pron:"/ˈɒnɪsti/",pos:"Noun"},
  {id:148,word:"INSPIRE",cat:"Actions",hint:"To fill with the urge to create",meaning:"To fill someone with the urge to do something creative.",example:"Her story inspired me to write my own book.",fact:"The word 'inspire' means 'to breathe into' in Latin!",pron:"/ɪnˈspaɪər/",pos:"Verb"},
  {id:149,word:"TRIUMPH",cat:"Actions",hint:"A great victory",meaning:"A great victory or achievement.",example:"The team celebrated their triumph.",fact:"The word comes from Roman victory parades!",pron:"/ˈtraɪʌmf/",pos:"Noun",special:"speed"},
  {id:150,word:"JUSTICE",cat:"Values",hint:"Fair treatment of all people",meaning:"Just behavior or treatment; fairness.",example:"Everyone deserves justice and equality.",fact:"The symbol of justice is a blindfolded woman with scales!",pron:"/ˈdʒʌstɪs/",pos:"Noun"}
];

// === Game State ===
let currentLevel = 1;
let currentLevelData = null;
let placedLetters = [];
let timeLeft = 60;
let timerInterval = null;
let score = 0;
let coins = 0;
let xp = 0;
let streak = 0;
let levelResults = {};
let page = 0;
const PAGE_SIZE = 30;

// === Audio Context for sounds ===
let audioCtx;
function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
function playTone(freq, dur, type='sine') {
  try {
    initAudio();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.15, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + dur);
  } catch(e) {}
}
function playClick() { playTone(800, 0.08); }
function playPlace() { playTone(600, 0.1); }
function playCorrect() { playTone(523, 0.15); setTimeout(() => playTone(659, 0.15), 100); setTimeout(() => playTone(784, 0.3), 200); }
function playWrong() { playTone(200, 0.2, 'sawtooth'); }
function playWin() { [523,587,659,698,784].forEach((f,i) => setTimeout(() => playTone(f, 0.2), i*100)); }

// === Persistence ===
function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem('wq_state') || '{}');
    coins = s.coins || 0;
    xp = s.xp || 0;
    currentLevel = s.currentLevel || 1;
    streak = s.streak || 0;
    levelResults = s.levelResults || {};
  } catch(e) {}
}
function saveState() {
  localStorage.setItem('wq_state', JSON.stringify({coins, xp, currentLevel, streak, levelResults}));
}

// === Screen Management ===
function showScreen(id) {
  document.querySelectorAll('.scr').forEach(s => s.classList.remove('on'));
  document.getElementById(id).classList.add('on');
  if (id === 'home') updateHome();
}

function updateHome() {
  document.getElementById('hCoins').textContent = coins;
  document.getElementById('hXP').textContent = xp;
  document.getElementById('hLevel').textContent = currentLevel;
}

// === Level Select ===
function showLevels() {
  page = Math.floor((currentLevel - 1) / PAGE_SIZE);
  renderLevelGrid();
  showScreen('levelSelect');
}

function changePage(d) {
  page = Math.max(0, Math.min(page + d, Math.ceil(ALL_LEVELS.length / PAGE_SIZE) - 1));
  renderLevelGrid();
}

function renderLevelGrid() {
  const grid = document.getElementById('levelGrid');
  const start = page * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, ALL_LEVELS.length);
  let html = '';
  for (let i = start; i < end; i++) {
    const lv = ALL_LEVELS[i];
    const num = lv.id;
    const r = levelResults[num];
    const isDone = !!r;
    const isCur = num === currentLevel;
    const isLock = num > currentLevel;
    let cls = 'lbtn';
    if (isLock) cls += ' lock';
    else if (isDone) cls += ' done';
    else if (isCur) cls += ' cur';
    const starStr = r ? ('⭐'.repeat(r.stars) + '☆'.repeat(3 - r.stars)) : '';
    html += `<button class="${cls}" onclick="${isLock ? '' : 'pickLevel('+num+')'}" ${isLock ? 'disabled' : ''}>
      <div>${num}</div>
      <div class="st">${starStr}</div>
    </button>`;
  }
  grid.innerHTML = html;
  document.getElementById('pageInfo').textContent = `Levels ${start+1}–${end} of ${ALL_LEVELS.length}`;
  document.getElementById('prevBtn').style.display = page > 0 ? '' : 'none';
  document.getElementById('nextBtn').style.display = end < ALL_LEVELS.length ? '' : 'none';
}

function pickLevel(n) {
  playClick();
  startLevel(n);
}

// === Game Logic ===
function getLevelData(id) {
  return ALL_LEVELS.find(l => l.id === id) || ALL_LEVELS[0];
}

function getTimer(level) {
  if (level <= 20) return 60;
  if (level <= 50) return 55;
  if (level <= 100) return 50;
  if (level <= 150) return 45;
  return 40;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startLevel(n) {
  currentLevel = n;
  currentLevelData = getLevelData(n);
  placedLetters = [];
  timeLeft = getTimer(n);
  score = 0;

  document.getElementById('gLevel').textContent = 'Level ' + n;
  document.getElementById('gCategory').textContent = currentLevelData.cat;
  document.getElementById('gScore').textContent = '0';
  document.getElementById('gCoins').textContent = coins;
  document.getElementById('gTimer').textContent = timeLeft;
  document.getElementById('gHint').textContent = '💡 ' + currentLevelData.hint;

  const word = currentLevelData.word;
  const shuffled = shuffle(word.split(''));

  const dz = document.getElementById('dropZone');
  dz.innerHTML = '';
  dz.className = 'dz';
  for (let i = 0; i < word.length; i++) {
    const slot = document.createElement('div');
    slot.className = 'ts';
    slot.dataset.index = i;
    slot.addEventListener('click', () => removeFromSlot(i));
    dz.appendChild(slot);
  }

  const lr = document.getElementById('letterRack');
  lr.innerHTML = '';
  shuffled.forEach((ch, i) => {
    const tile = document.createElement('div');
    tile.className = 't tl';
    tile.textContent = ch;
    tile.dataset.letter = ch;
    tile.dataset.rackIndex = i;
    tile.addEventListener('click', () => placeLetter(tile));
    lr.appendChild(tile);
  });

  clearInterval(timerInterval);
  updateTimerBar();
  timerInterval = setInterval(tick, 1000);

  showScreen('game');
}

function placeLetter(tile) {
  if (tile.classList.contains('pl')) return;
  const nextSlot = document.querySelector('.ts:not(.f)');
  if (!nextSlot) return;
  playPlace();
  tile.classList.add('pl');
  const idx = parseInt(nextSlot.dataset.index);
  placedLetters[idx] = tile.dataset.letter;
  nextSlot.textContent = tile.dataset.letter;
  nextSlot.classList.add('f');
  nextSlot.dataset.tileRack = tile.dataset.rackIndex;

  if (placedLetters.filter(x => x).length === currentLevelData.word.length) {
    checkAnswer();
  }
}

function removeFromSlot(idx) {
  if (!placedLetters[idx]) return;
  playClick();
  const slot = document.querySelectorAll('.ts')[idx];
  const rackIdx = slot.dataset.tileRack;
  const tile = document.querySelector(`.t[data-rack-index="${rackIdx}"]`);
  if (tile) tile.classList.remove('pl');
  placedLetters[idx] = undefined;
  slot.textContent = '';
  slot.classList.remove('f');
  slot.dataset.tileRack = '';
}

function clearAnswer() {
  playClick();
  placedLetters = [];
  document.querySelectorAll('.ts').forEach(s => {
    s.textContent = '';
    s.classList.remove('f', 'ok');
    s.dataset.tileRack = '';
  });
  document.querySelectorAll('.t.tl').forEach(t => t.classList.remove('pl'));
}

function shuffleLetters() {
  playClick();
  const rack = document.getElementById('letterRack');
  const tiles = [...rack.querySelectorAll('.t.tl')];
  const activeTiles = tiles.filter(t => !t.classList.contains('pl'));
  const inactiveTiles = tiles.filter(t => t.classList.contains('pl'));
  const shuffledActive = shuffle(activeTiles);
  rack.innerHTML = '';
  shuffledActive.forEach(t => rack.appendChild(t));
  inactiveTiles.forEach(t => rack.appendChild(t));
}

function useHint() {
  if (coins < 3) { showFloatingMsg('Not enough coins! 🪙'); return; }
  const word = currentLevelData.word;
  const emptySlots = [];
  for (let i = 0; i < word.length; i++) {
    if (placedLetters[i] !== word[i]) emptySlots.push(i);
  }
  if (emptySlots.length === 0) return;
  playClick();
  coins -= 3;
  const targetIdx = emptySlots[Math.floor(Math.random() * emptySlots.length)];
  const neededChar = word[targetIdx];

  const rackTiles = document.querySelectorAll('.t.tl:not(.pl)');
  for (const tile of rackTiles) {
    if (tile.dataset.letter === neededChar) {
      playPlace();
      tile.classList.add('pl');
      placedLetters[targetIdx] = neededChar;
      const slot = document.querySelectorAll('.ts')[targetIdx];
      slot.textContent = neededChar;
      slot.classList.add('f');
      slot.dataset.tileRack = tile.dataset.rackIndex;
      break;
    }
  }
  document.getElementById('gCoins').textContent = coins;
  saveState();
  if (placedLetters.filter(x => x).length === word.length) checkAnswer();
}

function tick() {
  timeLeft--;
  document.getElementById('gTimer').textContent = timeLeft;
  updateTimerBar();
  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    showResult(false);
  }
}

function updateTimerBar() {
  const max = getTimer(currentLevel);
  const pct = (timeLeft / max) * 100;
  const fill = document.getElementById('timerFill');
  fill.style.width = pct + '%';
  fill.className = 'tf';
  if (pct < 25) fill.classList.add('d');
  else if (pct < 50) fill.classList.add('w');
}

function checkAnswer() {
  clearInterval(timerInterval);
  const word = currentLevelData.word;
  const answer = placedLetters.join('');
  const correct = answer === word;

  document.querySelectorAll('.ts').forEach(s => s.classList.add('ok'));

  if (correct) {
    playWin();
    const max = getTimer(currentLevel);
    const timeBonus = Math.floor((timeLeft / max) * 50);
    score = 100 + timeBonus;
    const isSpecial = currentLevelData.special === 'coin';
    const coinReward = isSpecial ? 30 : 10 + Math.floor(score / 20);
    const xpReward = 20 + Math.floor(score / 10);
    coins += coinReward;
    xp += xpReward;
    streak++;

    const stars = timeLeft > max * 0.7 ? 3 : timeLeft > max * 0.4 ? 2 : 1;
    levelResults[currentLevel] = { score, stars, coinReward };
    if (currentLevel >= currentLevel && currentLevel < ALL_LEVELS.length) {
      currentLevel = Math.max(currentLevel, currentLevelData.id + 1);
    }
    saveState();
    setTimeout(() => showResult(true, score, coinReward, xpReward, stars), 500);
  } else {
    playWrong();
    streak = 0;
    saveState();
    document.querySelectorAll('.ts').forEach(s => {
      s.style.animation = 'none';
      s.offsetHeight;
      s.style.animation = '';
    });
    setTimeout(() => {
      clearAnswer();
      showFloatingMsg('Try again! 💪');
    }, 800);
  }
}

function showResult(won, sc, cr, xr, st) {
  document.getElementById('rIcon').textContent = won ? '🎉' : '⏰';
  document.getElementById('rTitle').textContent = won
    ? ['Great Job!', 'Excellent!', 'Amazing!', 'Fantastic!', 'Brilliant!', 'Super Star!'][Math.floor(Math.random() * 6)]
    : ['Time\'s Up!', 'Almost!', 'Keep Trying!', 'You\'re Close!'][Math.floor(Math.random() * 4)];
  document.getElementById('rSub').textContent = won
    ? `You solved "${currentLevelData.word}"!`
    : 'Don\'t give up, try again!';

  const starsHtml = won
    ? [1,2,3].map(i => `<span class="sr ${i <= st ? 'e' : ''}" style="animation-delay:${i*0.2}s">⭐</span>`).join('')
    : '';
  document.getElementById('rStars').innerHTML = starsHtml;

  const li = currentLevelData;
  document.getElementById('rWordInfo').innerHTML = won ? `
    <h3>${li.word}</h3>
    <div class="pr">${li.pron}</div>
    <div class="po">${li.pos}</div>
    <div class="mn"><b>Meaning:</b> ${li.meaning}</div>
    <div class="ex">"${li.example}"</div>
    <div class="ff">💡 Fun Fact: ${li.fact}</div>
  ` : '';

  document.getElementById('rRewards').innerHTML = won
    ? `<span class="rw">⭐ ${sc}</span><span class="rw">🪙 +${cr}</span><span class="rw">✨ +${xr} XP</span>`
    : '';

  document.getElementById('rMsg').textContent = won ? '' : getEncouragement();
  document.getElementById('rMsg').style.color = won ? 'var(--gn)' : 'var(--or)';

  showScreen('result');
  if (won) fireConfetti();
}

function getEncouragement() {
  const msgs = [
    "You're improving every time! 💪",
    "Practice makes perfect! 🌟",
    "Every attempt makes you smarter! 🧠",
    "You can do this! Keep going! 🚀",
    "Great effort — try again! ✨"
  ];
  return msgs[Math.floor(Math.random() * msgs.length)];
}

function nextLevel() {
  playClick();
  if (currentLevelData.id < ALL_LEVELS.length) {
    startLevel(currentLevelData.id + 1);
  } else {
    showScreen('home');
    showFloatingMsg('🎉 You completed all levels!');
  }
}

function showFloatingMsg(msg) {
  const div = document.createElement('div');
  div.textContent = msg;
  div.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(26,26,46,0.95);color:#fff;padding:16px 28px;border-radius:14px;font-size:16px;font-weight:700;z-index:1000;pointer-events:none;animation:pi .3s ease';
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 1500);
}

// === Confetti ===
function fireConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const particles = [];
  const colors = ['#6C63FF','#FF6B6B','#FFD700','#51CF66','#22B8CF','#CC5DE8','#FF922B'];
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 200,
      w: 6 + Math.random() * 6,
      h: 4 + Math.random() * 4,
      vx: (Math.random() - 0.5) * 4,
      vy: 2 + Math.random() * 4,
      rot: Math.random() * Math.PI * 2,
      rv: (Math.random() - 0.5) * 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1
    });
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    for (const p of particles) {
      if (p.life <= 0) continue;
      alive = true;
      p.x += p.vx;
      p.vy += 0.08;
      p.y += p.vy;
      p.rot += p.rv;
      p.life -= 0.005;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    }
    if (alive) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

// === Init ===
loadState();
updateHome();
