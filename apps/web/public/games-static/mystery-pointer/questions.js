// ==========================================
// MYSTERY POINTER QUIZ - VOCABULARY QUESTIONS
// ==========================================
// Each question: sentence with blank, 4 meaning options,
// correct index, hint (mnemonic), and the vocabulary word.

var QUESTIONS = {
    // Level 1: Questions 1-10
    1: [
        {
            question: "The heavy rain began to ______ after several hours.",
            options: ["LESSEN", "SHORTEN", "GATHER", "RELIEVE"],
            correct: 0,
            hint: "bat",
            word: "ABATE",
            meaning: "To lessen or reduce in intensity."
        },
        {
            question: "The editor decided to ______ the long article so it would fit on one page.",
            options: ["SHORTEN", "LESSEN", "COLLECT", "PRAISE"],
            correct: 0,
            hint: "bridge",
            word: "ABRIDGE",
            meaning: "To shorten a piece of writing."
        },
        {
            question: "Although there was a lot of food at the party, Maya was ______ and ate only a small amount.",
            options: ["MODERATE", "ABSTRACT", "FRIENDLY", "CRUEL"],
            correct: 0,
            hint: "stay + mew",
            word: "ABSTEMIOUS",
            meaning: "Moderate in eating and drinking."
        },
        {
            question: "The idea of justice is ______ because it cannot be touched or seen.",
            options: ["THEORETICAL", "PRACTICAL", "TANGIBLE", "PHYSICAL"],
            correct: 0,
            hint: "track",
            word: "ABSTRACT",
            meaning: "Existing in thought but not physical."
        },
        {
            question: "The scientist's explanation was so ______ that the students found it difficult to understand.",
            options: ["OBSCURE", "SIMPLE", "CLEAR", "STRAIGHTFORWARD"],
            correct: 0,
            hint: "true use",
            word: "ABSTRUSE",
            meaning: "Difficult to understand."
        },
        {
            question: "The new library is easily ______ to students because it is near the school.",
            options: ["REACHABLE", "DISTANT", "REMOTE", "INACCESSIBLE"],
            correct: 0,
            hint: "Asus",
            word: "ACCESSIBLE",
            meaning: "Easy to reach or approach."
        },
        {
            question: "The young singer received great ______ after her amazing performance.",
            options: ["PRAISE", "CRITICISM", "SILENCE", "CONDEMNATION"],
            correct: 0,
            hint: "Claim",
            word: "ACCLAIM",
            meaning: "Enthusiastic praise or approval."
        },
        {
            question: "The scientist received an ______ for her outstanding contribution to science.",
            options: ["HONOR", "PUNISHMENT", "CRITIQUE", "ASSIGNMENT"],
            correct: 0,
            hint: "1 + LadU",
            word: "ACCOLADE",
            meaning: "An award or privilege given as recognition."
        },
        {
            question: "After making a mistake, Rahul decided to ______ that he was wrong.",
            options: ["ADMIT", "DENY", "IGNORE", "REJECT"],
            correct: 0,
            hint: "knowledge",
            word: "ACKNOWLEDGE",
            meaning: "To accept or admit the truth of something."
        },
        {
            question: "After discussing the plan with his parents, Rahul decided to ______ to their suggestion.",
            options: ["CONSENT", "REFUSE", "RESIST", "OPPOSE"],
            correct: 0,
            hint: "21",
            word: "ACQUIESCE",
            meaning: "To accept something reluctantly."
        }
    ],

    // Level 2: Questions 11-20
    2: [
        {
            question: "An ______ smell filled the room when the food began to burn.",
            options: ["HARSH", "SWEET", "MILD", "PLEASANT"],
            correct: 0,
            hint: "1 + READ",
            word: "ACRID",
            meaning: "Having a strong, unpleasant smell or taste."
        },
        {
            question: "The two players had an ______ argument after the match.",
            options: ["BITTER", "FRIENDLY", "CALM", "PEACEFUL"],
            correct: 0,
            hint: "Cry + Muni (Sage)",
            word: "ACRIMONIOUS",
            meaning: "Angry and bitter in tone."
        },
        {
            question: "The famous actor received a lot of ______ from his fans.",
            options: ["PRAISE", "CRITICISM", "INDIFFERENCE", "CONDEMNATION"],
            correct: 0,
            hint: "adult lesson",
            word: "ADULATION",
            meaning: "Excessive admiration or praise."
        },
        {
            question: "The chess player carefully planned her move against her strongest ______.",
            options: ["OPPONENT", "ALLY", "PARTNER", "FRIEND"],
            correct: 0,
            hint: "sari",
            word: "ADVERSARY",
            meaning: "An enemy or opponent."
        },
        {
            question: "Despite facing great ______, the young athlete never gave up.",
            options: ["DIFFICULTY", "SUCCESS", "PROSPERITY", "FORTUNE"],
            correct: 0,
            hint: "city",
            word: "ADVERSITY",
            meaning: "A difficult or unfavorable situation."
        },
        {
            question: "Many doctors ______ regular exercise for a healthy lifestyle.",
            options: ["SUPPORT", "DISCOURAGE", "OPPOSE", "DENOUNCE"],
            correct: 0,
            hint: "advocate",
            word: "ADVOCATE",
            meaning: "To publicly recommend or support."
        },
        {
            question: "The designer added beautiful colors to improve the ______ appeal of the room.",
            options: ["BEAUTY", "UGLINESS", "FUNCTION", "PRACTICALITY"],
            correct: 0,
            hint: "ass thought",
            word: "AESTHETIC",
            meaning: "Relating to beauty or the appreciation of beauty."
        },
        {
            question: "The new teacher was so ______ that every student felt comfortable talking to her.",
            options: ["FRIENDLY", "HOSTILE", "UNFRIENDLY", "RESERVED"],
            correct: 0,
            hint: "(favour) bull",
            word: "AFFABLE",
            meaning: "Friendly, good-natured, and easy to talk to."
        },
        {
            question: "The coach gave the team an ______ that their hard work would lead to success.",
            options: ["STATEMENT", "DENIAL", "REJECTION", "CRITICISM"],
            correct: 0,
            hint: "(a for) mess",
            word: "AFFIRMATION",
            meaning: "A positive statement or confirmation."
        },
        {
            question: "The teacher asked us to ______ all the students' scores to calculate the final result.",
            options: ["COMBINE", "SEPARATE", "DIVIDE", "SCATTER"],
            correct: 0,
            hint: "agree",
            word: "AGGREGATE",
            meaning: "To form or group into a whole."
        }
    ],

    // Level 3: Questions 21-23 + 7 bonus
    3: [
        {
            question: "The medicine helped ______ the patient's pain.",
            options: ["RELIEVE", "WORSEN", "INTENSIFY", "AGGRAVATE"],
            correct: 0,
            hint: "ali bat",
            word: "ALLEVIATE",
            meaning: "To make suffering less severe."
        },
        {
            question: "The boy remained ______ and stayed away from the other children at the party.",
            options: ["DISTANT", "FRIENDLY", "SOCIABLE", "ENGAGING"],
            correct: 0,
            hint: "loop",
            word: "ALOOF",
            meaning: "Distant and unfriendly."
        },
        {
            question: "The ______ girl donated her prize money to help children in need.",
            options: ["SELFLESS", "SELFISH", "GREEDY", "SELF-CENTERED"],
            correct: 0,
            hint: "True Stick",
            word: "ALTRUISTIC",
            meaning: "Unselfishly generous and concerned for others."
        },
        {
            question: "The old man would often ______ about the good old days.",
            options: ["RECALL", "FORGET", "AVOID", "IGNORE"],
            correct: 0,
            hint: "remember + miss",
            word: "REMINISCE",
            meaning: "To recall past experiences nostalgically."
        },
        {
            question: "The company decided to ______ the outdated policy immediately.",
            options: ["CANCEL", "ESTABLISH", "MAINTAIN", "CONTINUE"],
            correct: 0,
            hint: "voke = vote",
            word: "REVOKE",
            meaning: "To officially cancel or withdraw."
        },
        {
            question: "The scientist made a ______ discovery that changed everything.",
            options: ["NOVEL", "ORDINARY", "TRADITIONAL", "CONVENTIONAL"],
            correct: 0,
            hint: "ground + break",
            word: "GROUNDBREAKING",
            meaning: "Introducing new ideas or methods."
        },
        {
            question: "The politician tried to ______ the crowd with her powerful speech.",
            options: ["CAPTIVATE", "BORE", "CONFUSE", "DISINTEREST"],
            correct: 0,
            hint: "en + thrill",
            word: "ENTHRALL",
            meaning: "To capture someone's complete attention."
        },
        {
            question: "The artist's work was known for its ______ and originality.",
            options: ["NOVELTY", "TRADITION", "CONFORMITY", "REGULARITY"],
            correct: 0,
            hint: "in + nova + tive",
            word: "INNOVATIVE",
            meaning: "Introducing new ideas and methods."
        },
        {
            question: "The manager decided to ______ the meeting until next week.",
            options: ["DELAY", "ADVANCE", "CANCEL", "PREPONE"],
            correct: 0,
            hint: "post + pone",
            word: "POSTPONE",
            meaning: "To delay or reschedule to a later time."
        },
        {
            question: "The team showed great ______ during the difficult project.",
            options: ["PERSISTENCE", "LAZINESS", "SURRENDER", "QUITTING"],
            correct: 0,
            hint: "persevere + ance",
            word: "PERSEVERANCE",
            meaning: "Persistence in doing something despite difficulty."
        }
    ]
};

var QUESTIONS_PER_LEVEL = 10;
var TOTAL_LEVELS = 3;

var LEVEL_NAMES = {
    1: "Vocabulary Builder I",
    2: "Vocabulary Builder II",
    3: "Vocabulary Builder III"
};
