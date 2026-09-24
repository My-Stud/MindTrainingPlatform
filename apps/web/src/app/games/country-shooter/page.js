"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Trophy, Heart, Crosshair, Play, ChevronRight, BookOpen } from "lucide-react";
import { useSession } from "next-auth/react";

const COUNTRIES_DATA = [
  { name: "India", capital: "New Delhi", currency: "Rupee", animal: "Tiger", bird: "Peacock", emblem: "Lion Capital", continent: "Asia", language: "Hindi", flower: "Lotus", sport: "Field Hockey", landmark: "Taj Mahal" },
  { name: "USA", capital: "Washington D.C.", currency: "Dollar", animal: "Bison", bird: "Bald Eagle", emblem: "Great Seal", continent: "North America", language: "English", flower: "Rose", sport: "Baseball", landmark: "Statue of Liberty" },
  { name: "Japan", capital: "Tokyo", currency: "Yen", animal: "Macaque", bird: "Green Pheasant", emblem: "Chrysanthemum", continent: "Asia", language: "Japanese", flower: "Cherry Blossom", sport: "Sumo", landmark: "Mount Fuji" },
  { name: "Australia", capital: "Canberra", currency: "AUD", animal: "Kangaroo", bird: "Emu", emblem: "Coat of Arms", continent: "Oceania", language: "English", flower: "Golden Wattle", sport: "Cricket", landmark: "Opera House" },
  { name: "Brazil", capital: "Brasilia", currency: "Real", animal: "Jaguar", bird: "Rufous-bellied Thrush", emblem: "Southern Cross", continent: "South America", language: "Portuguese", flower: "Corsage Orchid", sport: "Capoeira", landmark: "Christ the Redeemer" },
  { name: "Canada", capital: "Ottawa", currency: "CAD", animal: "Beaver", bird: "Gray Jay", emblem: "Maple Leaf", continent: "North America", language: "English", flower: "Bunchberry", sport: "Ice Hockey", landmark: "CN Tower" },
  { name: "UK", capital: "London", currency: "Pound", animal: "Lion", bird: "Robin", emblem: "Royal Coat", continent: "Europe", language: "English", flower: "Tudor Rose", sport: "Rugby", landmark: "Big Ben" },
  { name: "France", capital: "Paris", currency: "Euro", animal: "Brown Bear", bird: "Rooster", emblem: "Fasces", continent: "Europe", language: "French", flower: "Iris", sport: "Cycling", landmark: "Eiffel Tower" },
  { name: "Germany", capital: "Berlin", currency: "Euro", animal: "Red Fox", bird: "Golden Eagle", emblem: "Federal Eagle", continent: "Europe", language: "German", flower: "Cornflower", sport: "Handball", landmark: "Brandenburg Gate" },
  { name: "China", capital: "Beijing", currency: "Yuan", animal: "Giant Panda", bird: "Red-crowned Crane", emblem: "Tiananmen", continent: "Asia", language: "Mandarin", flower: "Plum Blossom", sport: "Table Tennis", landmark: "Great Wall" },
  { name: "South Africa", capital: "Pretoria", currency: "Rand", animal: "Springbok", bird: "Blue Crane", emblem: "Protea", continent: "Africa", language: "Afrikaans", flower: "King Protea", sport: "Cricket", landmark: "Table Mountain" },
  { name: "Mexico", capital: "Mexico City", currency: "Peso", animal: "Xoloitzcuintli", bird: "Golden Eagle", emblem: "Eagle & Snake", continent: "North America", language: "Spanish", flower: "Dahlia", sport: "Charreria", landmark: "Chichen Itza" },
  { name: "Egypt", capital: "Cairo", currency: "Pound", animal: "Arabian Camel", bird: "Eagle of Saladin", emblem: "Eagle of Saladin", continent: "Africa", language: "Arabic", flower: "Egyptian Lotus", sport: "Squash", landmark: "Pyramids of Giza" },
  { name: "Italy", capital: "Rome", currency: "Euro", animal: "Wolf", bird: "Italian Sparrow", emblem: "Stella d'Italia", continent: "Europe", language: "Italian", flower: "Lily", sport: "Calcio Storico", landmark: "Colosseum" },
  { name: "Spain", capital: "Madrid", currency: "Euro", animal: "Bull", bird: "Spanish Imperial Eagle", emblem: "Pillars of Hercules", continent: "Europe", language: "Spanish", flower: "Red Carnation", sport: "Padel", landmark: "Sagrada Familia" },
  { name: "Argentina", capital: "Buenos Aires", currency: "Peso", animal: "Rufous Hornero", bird: "Rufous Hornero", emblem: "Sun of May", continent: "South America", language: "Spanish", flower: "Ceibo", sport: "Pato", landmark: "Casa Rosada" },
  { name: "Russia", capital: "Moscow", currency: "Ruble", animal: "Brown Bear", bird: "Tundra Swan", emblem: "Double-headed Eagle", continent: "Europe/Asia", language: "Russian", flower: "Chamomile", sport: "Bandy", landmark: "Kremlin" },
  { name: "South Korea", capital: "Seoul", currency: "Won", animal: "Siberian Tiger", bird: "Korean Magpie", emblem: "Taegeuk", continent: "Asia", language: "Korean", flower: "Hibiscus", sport: "Taekwondo", landmark: "Gyeongbokgung" },
  { name: "Indonesia", capital: "Jakarta", currency: "Rupiah", animal: "Komodo Dragon", bird: "Javan Hawk-Eagle", emblem: "Garuda", continent: "Asia", language: "Indonesian", flower: "Moon Orchid", sport: "Badminton", landmark: "Borobudur" },
  { name: "Turkey", capital: "Ankara", currency: "Lira", animal: "Grey Wolf", bird: "Redwing", emblem: "Star and Crescent", continent: "Europe/Asia", language: "Turkish", flower: "Tulip", sport: "Oil Wrestling", landmark: "Hagia Sophia" },
  { name: "Saudi Arabia", capital: "Riyadh", currency: "Riyal", animal: "Arabian Horse", bird: "Falcon", emblem: "Palm Tree and Swords", continent: "Asia", language: "Arabic", flower: "Arfaj", sport: "Football", landmark: "Kaaba" },
  { name: "Nigeria", capital: "Abuja", currency: "Naira", animal: "Eagle", bird: "Black Crowned Crane", emblem: "Coat of Arms", continent: "Africa", language: "English", flower: "Costus Spectabilis", sport: "Football", landmark: "Zuma Rock" },
  { name: "Kenya", capital: "Nairobi", currency: "Shilling", animal: "Lion", bird: "Lilac-breasted Roller", emblem: "Coat of Arms", continent: "Africa", language: "Swahili", flower: "Orchid", sport: "Athletics", landmark: "Masai Mara" },
  { name: "Sweden", capital: "Stockholm", currency: "Krona", animal: "Moose", bird: "Common Blackbird", emblem: "Three Crowns", continent: "Europe", language: "Swedish", flower: "Twinflower", sport: "Ice Hockey", landmark: "Vasa Museum" },
  { name: "Norway", capital: "Oslo", currency: "Krone", animal: "Lion", bird: "White-throated Dipper", emblem: "Coat of Arms", continent: "Europe", language: "Norwegian", flower: "Purple Heather", sport: "Skiing", landmark: "Preikestolen" },
  { name: "Greece", capital: "Athens", currency: "Euro", animal: "Dolphin", bird: "Little Owl", emblem: "Coat of Arms", continent: "Europe", language: "Greek", flower: "Bear's Breech", sport: "Football", landmark: "Parthenon" },
  { name: "New Zealand", capital: "Wellington", currency: "NZD", animal: "Kiwi", bird: "Kiwi", emblem: "Southern Cross", continent: "Oceania", language: "English", flower: "Kowhai", sport: "Rugby", landmark: "Milford Sound" },
  { name: "Thailand", capital: "Bangkok", currency: "Baht", animal: "Elephant", bird: "Siamese Fireback", emblem: "Garuda", continent: "Asia", language: "Thai", flower: "Golden Shower", sport: "Muay Thai", landmark: "Grand Palace" },
  { name: "Vietnam", capital: "Hanoi", currency: "Dong", animal: "Water Buffalo", bird: "Chim Lac", emblem: "Coat of Arms", continent: "Asia", language: "Vietnamese", flower: "Lotus", sport: "Vovinam", landmark: "Ha Long Bay" },
  { name: "Peru", capital: "Lima", currency: "Sol", animal: "Vicuña", bird: "Andean Cock-of-the-rock", emblem: "Coat of Arms", continent: "South America", language: "Spanish", flower: "Cantuta", sport: "Football", landmark: "Machu Picchu" }
];

const PROPERTY_TYPES = ["capital", "currency", "animal", "bird", "emblem", "continent", "language", "flower", "sport", "landmark"];

export default function CountryShooter() {
  const { data: session } = useSession();
  const [assignedExams, setAssignedExams] = useState([]);
  const [selectedMode, setSelectedMode] = useState("standard"); // "standard" or "custom"
  const [selectedExamId, setSelectedExamId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("flower");

  useEffect(() => {
    if (session) {
      fetch("/api/user/dashboard-data")
        .then(res => res.json())
        .then(data => {
          if (!data.error && data.assignedExams) {
            setAssignedExams(data.assignedExams);
            if (data.assignedExams.length > 0) {
              setSelectedExamId(data.assignedExams[0].id);
            }
          }
        });
    }
  }, [session]);
  const gameRef = useRef({
    gameState: "start", // start, countdown, playing, gameover
    score: 0,
    level: 1,
    lives: 3,
    targets: [],
    projectiles: [],
    particles: [],
    floatingTexts: [], // {x, y, text, color, life, vy}
    combo: 0,
    maxCombo: 0,
    correctHits: 0,
    wrongHits: 0,
    countdownValue: 3,
    selectedCategory: "flower",
    currentQuestion: null,
    targetSpawnTimer: 0,
    gunAngle: 0,
    mousePos: { x: 0, y: 0 },
    lastTime: 0,
    timeLeft: 30,
    levelQuestions: [],
    questionsAnswered: 0,
    levelCorrectCount: 0,
    usedPropertiesInLevel: [],
    globalUsedQuestions: [],
    mode: "standard",
    examQuestions: [], // All questions for the custom exam
  });

  const [renderTick, setRenderTick] = useState(0);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);

  const forceRender = () => setRenderTick(t => t + 1);

  // Helper to pick a random item
  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
  
  // Shuffle array
  const shuffle = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  };

  const startLevel = (levelNum) => {
    const state = gameRef.current;
    state.level = levelNum;
    state.questionsAnswered = 0;
    state.levelCorrectCount = 0;
    state.combo = 0;
    state.correctHits = 0;
    state.wrongHits = 0;
    
    if (!state.globalUsedQuestions) {
        state.globalUsedQuestions = [];
    }
    if (!state.selectedCategory) {
        state.selectedCategory = selectedCategory;
    }
    
    if (state.mode === "standard") {
      let available = COUNTRIES_DATA.filter(country => !state.globalUsedQuestions.includes(country.name));
      if (available.length < 10) {
         state.globalUsedQuestions = [];
         available = [...COUNTRIES_DATA];
      }
      shuffle(available);
      
      let selectedForLevel = [];
      let usedProps = [];
      
      for (let i = 0; i < available.length; i++) {
         const propValue = available[i][state.selectedCategory].toUpperCase();
         if (!usedProps.includes(propValue)) {
            selectedForLevel.push(available[i]);
            usedProps.push(propValue);
            state.globalUsedQuestions.push(available[i].name);
         }
         if (selectedForLevel.length === 10) break;
      }
      
      if (selectedForLevel.length < 10) {
         for (let i = 0; i < available.length && selectedForLevel.length < 10; i++) {
            if (!selectedForLevel.includes(available[i])) {
               selectedForLevel.push(available[i]);
               usedProps.push(available[i][state.selectedCategory].toUpperCase());
               state.globalUsedQuestions.push(available[i].name);
            }
         }
      }
      state.levelQuestions = selectedForLevel;
      state.usedPropertiesInLevel = usedProps;
    } else {
      // Custom mode
      let available = state.examQuestions.filter(q => !state.globalUsedQuestions.includes(q.id));
      if (available.length < 10 && state.examQuestions.length >= 10) {
          state.globalUsedQuestions = [];
          available = [...state.examQuestions];
      } else if (state.examQuestions.length < 10) {
          available = [...state.examQuestions];
          shuffle(available);
      }
      shuffle(available);
      const selectedForLevel = available.slice(0, 10);
      selectedForLevel.forEach(q => state.globalUsedQuestions.push(q.id));
      state.levelQuestions = selectedForLevel;
      state.usedPropertiesInLevel = [];
    }
    
    setNextQuestion();
  };

  const setNextQuestion = () => {
    const state = gameRef.current;
    state.targets = [];
    if (state.questionsAnswered < 10 && state.levelQuestions.length > 0) {
      const q = state.levelQuestions.shift();
      if (state.mode === "standard") {
        state.currentQuestion = { country: q, propType: state.selectedCategory };
      } else {
        state.currentQuestion = q; // Custom question object
      }
      state.timeLeft = 30; // Reset timer for new question
      forceRender();
    } else {
      // Level is finished
      if (state.levelCorrectCount >= 5) {
         // Level up
         if (canvasRef.current) {
            state.floatingTexts.push({
              x: canvasRef.current.width / 2,
              y: canvasRef.current.height / 2 - 100,
              text: "LEVEL COMPLETE! +50",
              color: "#fbbf24",
              life: 2.0,
              vy: -0.5
            });
         }
         state.score += 50 * state.level;
         state.gameState = "levelup";
         forceRender();
      } else {
         // Game over, back to level 1
         state.gameState = "gameover";
         if (canvasRef.current) {
            state.floatingTexts.push({
              x: canvasRef.current.width / 2,
              y: canvasRef.current.height / 2 - 100,
              text: "LEVEL FAILED!",
              color: "#ef4444",
              life: 2.0,
              vy: -0.5
            });
         }
         forceRender();
      }
    }
  };

  const advanceQuestion = () => {
    const state = gameRef.current;
    state.questionsAnswered++;
    setNextQuestion();
  };

  const startCountdown = () => {
    const state = gameRef.current;
    state.gameState = "countdown";
    state.score = 0;
    state.lives = 3;
    state.combo = 0;
    state.maxCombo = 0;
    state.correctHits = 0;
    state.wrongHits = 0;
    state.countdownValue = 3;
    state.globalUsedQuestions = [];
    state.targets = [];
    state.projectiles = [];
    state.particles = [];
    state.floatingTexts = [];
    state.lastTime = 0;
    
    state.mode = selectedMode;
    if (selectedMode === "custom") {
       const exam = assignedExams.find(e => e.id === selectedExamId);
       if (exam && exam.questionSet && exam.questionSet.questions) {
           state.examQuestions = exam.questionSet.questions;
       } else {
           // Fallback to standard if exam not fully loaded (shouldn't happen with our include)
           state.mode = "standard";
       }
    }
    
    startLevel(1);
    forceRender();

    let cnt = 3;
    const interval = setInterval(() => {
      cnt--;
      if (cnt > 0) {
        gameRef.current.countdownValue = cnt;
        forceRender();
      } else {
        clearInterval(interval);
        gameRef.current.gameState = "playing";
        gameRef.current.lastTime = 0; // Will be set on first frame
        forceRender();
      }
    }, 1000);
  };

  const continueNextLevel = () => {
    const state = gameRef.current;
    state.gameState = "countdown";
    state.countdownValue = 3;
    state.targets = [];
    state.projectiles = [];
    state.particles = [];
    state.floatingTexts = [];
    state.targetSpawnTimer = 0;
    state.lastTime = 0;
    
    startLevel(state.level + 1);
    forceRender();

    let cnt = 3;
    const interval = setInterval(() => {
      cnt--;
      if (cnt > 0) {
        gameRef.current.countdownValue = cnt;
        forceRender();
      } else {
        clearInterval(interval);
        gameRef.current.gameState = "playing";
        gameRef.current.lastTime = 0;
        forceRender();
      }
    }, 1000);
  };

  const spawnTarget = () => {
    const state = gameRef.current;
    
    // What's already on the track?
    const existingTexts = state.targets.map(t => t.text);
    
    let correctText = "";
    if (state.currentQuestion) {
        if (state.mode === "standard") {
            correctText = state.currentQuestion.country[state.currentQuestion.propType].toUpperCase();
        } else {
            correctText = state.currentQuestion.correctAnswer.toUpperCase();
        }
    }
    
    // 30% chance, but don't spawn it if it's already on the track
    let isCorrect = Math.random() < 0.3;
    if (existingTexts.includes(correctText)) {
      isCorrect = false;
    }

    let propText = "";
    
    if (isCorrect && state.currentQuestion) {
      propText = correctText;
    } else if (state.currentQuestion) {
      if (state.mode === "standard") {
        let randomCountry;
        let fakeText = "";
        let attempts = 0;
        do {
          randomCountry = pickRandom(COUNTRIES_DATA);
          fakeText = randomCountry[state.currentQuestion.propType].toUpperCase();
          attempts++;
        } while ((fakeText === correctText || existingTexts.includes(fakeText) || state.usedPropertiesInLevel.includes(fakeText)) && attempts < 50);
        
        if (attempts >= 50) {
           attempts = 0;
           do {
              randomCountry = pickRandom(COUNTRIES_DATA);
              fakeText = randomCountry[state.currentQuestion.propType].toUpperCase();
              attempts++;
           } while ((fakeText === correctText || existingTexts.includes(fakeText)) && attempts < 50);
        }
        propText = fakeText;
        if (!state.usedPropertiesInLevel.includes(fakeText)) {
            state.usedPropertiesInLevel.push(fakeText);
        }
      } else {
         // Custom fake options
         let fakeOptionsArray = [];
         try {
             fakeOptionsArray = JSON.parse(state.currentQuestion.fakeOptions);
         } catch(e) {
             fakeOptionsArray = ["Option A", "Option B", "Option C"];
         }
         let fakeText = "";
         let attempts = 0;
         do {
            fakeText = pickRandom(fakeOptionsArray).toUpperCase();
            attempts++;
         } while ((fakeText === correctText || existingTexts.includes(fakeText)) && attempts < 10);
         propText = fakeText;
      }
    }

    const HAPPY_COLORS = [
      { start: '#f472b6', end: '#db2777' }, // Pink
      { start: '#c084fc', end: '#9333ea' }, // Purple
      { start: '#fb923c', end: '#ea580c' }, // Orange
      { start: '#38bdf8', end: '#0284c7' }, // Blue
      { start: '#4ade80', end: '#16a34a' }, // Green
    ];

    state.targets.push({
      id: Math.random().toString(),
      text: propText, // already uppercased
      angle: 0, 
      speed: 0.0005 + (state.level * 0.0001), 
      radius: 70, 
      isCorrect: isCorrect,
      color: HAPPY_COLORS[Math.floor(Math.random() * HAPPY_COLORS.length)],
      laughTimer: 0
    });
  };

  const createParticles = (x, y, color) => {
    for (let i = 0; i < 15; i++) {
      gameRef.current.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        life: 1,
        color
      });
    }
  };

  const fireProjectile = () => {
    const state = gameRef.current;
    if (state.gameState !== "playing") return;

    state.projectiles.push({
      x: 0, 
      y: 0, 
      vx: Math.cos(state.gunAngle) * 10,
      vy: Math.sin(state.gunAngle) * 10,
      radius: 8
    });
  };

  const handleMouseMove = (e) => {
    if (gameRef.current.gameState !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - canvas.width / 2;
    const y = e.clientY - rect.top - canvas.height / 2;
    
    gameRef.current.mousePos = { x, y };
    gameRef.current.gunAngle = Math.atan2(y, x);
  };

  const handleMouseClick = (e) => {
    fireProjectile();
  };

  const updateGame = useCallback((time) => {
    const state = gameRef.current;
    if (state.gameState !== "playing") {
      requestRef.current = requestAnimationFrame(updateGame);
      return;
    }

    if (!state.lastTime) {
      state.lastTime = time;
    }

    const deltaTime = time - state.lastTime;
    state.lastTime = time;


    // Timer logic
    state.timeLeft -= deltaTime / 1000;
    if (state.timeLeft <= 0) {
      state.score = Math.max(0, state.score - 50);
      state.combo = 0;
      if (canvasRef.current) {
        state.floatingTexts.push({
          x: canvasRef.current.width / 2,
          y: canvasRef.current.height / 2 - 100,
          text: "TIME'S UP! -50",
          color: "#ef4444",
          life: 2.0,
          vy: -1
        });
      }
      advanceQuestion();
      // Wait for next frame
      requestRef.current = requestAnimationFrame(updateGame);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      requestRef.current = requestAnimationFrame(updateGame);
      return;
    }
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxTrackRadius = Math.min(width, height) / 2 - 90;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Canvas Background with depth (Sunny Sky)
    const bgGrad = ctx.createRadialGradient(centerX, centerY, 50, centerX, centerY, width);
    bgGrad.addColorStop(0, '#bae6fd'); // sky-200
    bgGrad.addColorStop(1, '#38bdf8'); // sky-400
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);
    
    // Draw 3D Track (Golden/Wood Path)
    // 1. Drop shadow for track
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxTrackRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 46;
    ctx.stroke();
    // 2. Track Base
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxTrackRadius, 0, Math.PI * 2);
    ctx.strokeStyle = '#fcd34d'; // amber-300
    ctx.lineWidth = 40;
    ctx.stroke();
    // 3. Track Rails
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxTrackRadius - 15, 0, Math.PI * 2);
    ctx.strokeStyle = '#d97706'; // amber-600
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxTrackRadius + 15, 0, Math.PI * 2);
    ctx.stroke();

    // Spawning logic
    state.targetSpawnTimer += deltaTime;
    const spawnRate = Math.max(1000, 2500 - (state.level * 200));
    if (state.targetSpawnTimer > spawnRate) {
      spawnTarget();
      state.targetSpawnTimer = 0;
    }

    // Update & Draw Targets
    for (let i = state.targets.length - 1; i >= 0; i--) {
      const target = state.targets[i];
      target.angle += target.speed * deltaTime;
      
      // Calculate position
      const tX = centerX + Math.cos(target.angle) * maxTrackRadius;
      const tY = centerY + Math.sin(target.angle) * maxTrackRadius;
      target.x = tX;
      target.y = tY;

      // Draw train boggiee
      const bWidth = 200;
      const bHeight = 76;
      
      ctx.save();
      ctx.translate(tX, tY);
      
      // Rotate tangent to the arc
      let drawAngle = target.angle + Math.PI / 2;
      let normalizedAngle = drawAngle % (Math.PI * 2);
      if (normalizedAngle < 0) normalizedAngle += Math.PI * 2;
      
      const isUpsideDown = (normalizedAngle > Math.PI / 2 && normalizedAngle < (Math.PI * 3) / 2);
      
      ctx.rotate(drawAngle);
      
      // Shadow
      ctx.beginPath();
      if (ctx.roundRect) {
         ctx.roundRect(-bWidth/2 + 5, -bHeight/2 + 5, bWidth, bHeight, 12);
      } else {
         ctx.rect(-bWidth/2 + 5, -bHeight/2 + 5, bWidth, bHeight);
      }
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fill();

      // Main Body
      ctx.beginPath();
      if (ctx.roundRect) {
         ctx.roundRect(-bWidth/2, -bHeight/2, bWidth, bHeight, 12);
      } else {
         ctx.rect(-bWidth/2, -bHeight/2, bWidth, bHeight);
      }
      const grad = ctx.createLinearGradient(-bWidth/2, -bHeight/2, bWidth/2, bHeight/2);
      grad.addColorStop(0, target.color.start);
      grad.addColorStop(1, target.color.end);
      ctx.fillStyle = grad;
      ctx.fill();
      
      // Roof/Highlight
      ctx.beginPath();
      if (ctx.roundRect) {
         ctx.roundRect(-bWidth/2 + 4, -bHeight/2 + 4, bWidth - 8, 10, 4);
      } else {
         ctx.rect(-bWidth/2 + 4, -bHeight/2 + 4, bWidth - 8, 10);
      }
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Wheels
      const drawWheel = (wx, wy) => {
        ctx.fillStyle = '#1e293b'; // slate-800
        ctx.beginPath();
        ctx.arc(wx, wy, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#94a3b8'; // slate-400
        ctx.beginPath();
        ctx.arc(wx, wy, 4, 0, Math.PI * 2);
        ctx.fill();
      };
      
      // Wheels drawn towards the center of the arc (positive Y after rotation)
      drawWheel(-bWidth/2 + 30, bHeight/2 + 2);
      drawWheel(bWidth/2 - 30, bHeight/2 + 2);
      
      // Update local target laugh timer
      if (target.laughTimer > 0) {
        target.laughTimer -= deltaTime / 16.66;
      }
      
      // Monkey on the roof (negative Y)
      ctx.save();
      ctx.translate(0, -bHeight/2 - 20);
      
      let isLaughing = false;
      if (target.laughTimer > 0) {
          isLaughing = true;
          // Shake the monkey violently
          const shakeX = (Math.random() - 0.5) * 16;
          const shakeY = (Math.random() - 0.5) * 16;
          ctx.translate(shakeX, shakeY);
          // Scale up while laughing
          ctx.scale(1.3, 1.3);
      }
      
      // Custom Full-Body Canvas Monkey
      ctx.save();
      ctx.scale(0.9, 0.9);
      ctx.translate(0, -5); // Shift up slightly
      
      const brown = '#8b4513';
      const tan = '#d2b48c';
      
      // Tail
      ctx.strokeStyle = brown;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(10, 15);
      ctx.quadraticCurveTo(25, 15, 20, 0);
      ctx.stroke();

      // Legs
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-6, 15); ctx.lineTo(-10, 25); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(6, 15); ctx.lineTo(10, 25); ctx.stroke();

      // Arms
      ctx.beginPath(); ctx.moveTo(-10, 5); ctx.lineTo(-18, 15); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(10, 5); ctx.lineTo(18, 15); ctx.stroke();

      // Body
      ctx.fillStyle = brown;
      ctx.beginPath();
      if (ctx.ellipse) ctx.ellipse(0, 10, 12, 16, 0, 0, Math.PI*2);
      else ctx.arc(0, 10, 12, 0, Math.PI*2);
      ctx.fill();
      
      // Belly
      ctx.fillStyle = tan;
      ctx.beginPath();
      if (ctx.ellipse) ctx.ellipse(0, 12, 8, 10, 0, 0, Math.PI*2);
      else ctx.arc(0, 12, 8, 0, Math.PI*2);
      ctx.fill();
      
      // Head
      ctx.translate(0, -8);
      // Ears
      ctx.fillStyle = brown;
      ctx.beginPath(); ctx.arc(-15, -2, 7, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(15, -2, 7, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = tan;
      ctx.beginPath(); ctx.arc(-15, -2, 3, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(15, -2, 3, 0, Math.PI*2); ctx.fill();
      // Head shape
      ctx.fillStyle = brown;
      ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI*2); ctx.fill();
      // Face area
      ctx.fillStyle = tan;
      ctx.beginPath();
      if (ctx.ellipse) ctx.ellipse(0, 3, 13, 10, 0, 0, Math.PI*2);
      else ctx.arc(0, 3, 11, 0, Math.PI*2);
      ctx.fill();
      
      // Eyes
      ctx.fillStyle = 'white';
      ctx.beginPath(); ctx.arc(-5, -4, 4, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(5, -4, 4, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = 'black';
      ctx.beginPath(); ctx.arc(-5, -4, 2, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(5, -4, 2, 0, Math.PI*2); ctx.fill();
      
      // Mouth (Laughing with teeth)
      if (isLaughing) {
         ctx.fillStyle = 'black';
         ctx.beginPath();
         ctx.arc(0, 5, 8, 0, Math.PI);
         ctx.fill();
         // Teeth
         ctx.fillStyle = 'white';
         ctx.fillRect(-5, 5, 10, 3.5);
      } else {
         ctx.strokeStyle = 'black';
         ctx.lineWidth = 1.5;
         ctx.beginPath();
         ctx.arc(0, 5, 4, 0, Math.PI);
         ctx.stroke();
      }
      ctx.restore();
      
      if (isLaughing) {
         ctx.textAlign = 'center';
         ctx.textBaseline = 'middle';
         ctx.font = '900 24px Inter, sans-serif';
         ctx.fillStyle = '#ef4444'; // Red haha
         ctx.lineWidth = 4;
         ctx.strokeStyle = 'white';
         const laughStr = 'HAHAHA!';
         ctx.strokeText(laughStr, 0, -50);
         ctx.fillText(laughStr, 0, -50);
      }
      
      ctx.restore();

      // Text handling
      ctx.save();
      if (isUpsideDown) {
          ctx.rotate(Math.PI);
      }
      
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const fontSize = 22;
      ctx.font = `900 ${fontSize}px Inter, sans-serif`;
      const maxWidth = bWidth - 20;
      
      const words = target.text.split(' ');
      let lines = [];
      let currentLine = words[0];

      for (let w = 1; w < words.length; w++) {
        const testLine = currentLine + " " + words[w];
        if (ctx.measureText(testLine).width > maxWidth) {
          lines.push(currentLine);
          currentLine = words[w];
        } else {
          currentLine = testLine;
        }
      }
      lines.push(currentLine);
      
      const lineHeight = fontSize * 1.2;
      const startY = - ((lines.length - 1) * lineHeight) / 2;
      
      lines.forEach((line, index) => {
        const lineY = startY + (index * lineHeight);
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillText(line, 2, lineY + 2);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(line, 0, lineY);
      });
      
      ctx.restore(); // restore text rotation
      ctx.restore(); // restore bogie translation and rotation

      // If target reaches full circle
      if (target.angle >= Math.PI * 2) {
        state.targets.splice(i, 1);
        state.score = Math.max(0, state.score - 50);
        state.combo = 0;
        state.floatingTexts.push({
          x: target.x, y: target.y,
          text: "MISSED! -50",
          color: "#ef4444",
          life: 2.0,
          vy: -1
        });
      }
    }

    // Update & Draw Projectiles
    for (let i = state.projectiles.length - 1; i >= 0; i--) {
      const p = state.projectiles[i];
      p.x += p.vx;
      p.y += p.vy;
      
      const px = centerX + p.x;
      const py = centerY + p.y;

      // Projectile Shadow
      ctx.beginPath();
      ctx.arc(px + 3, py + 3, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fill();

      // Projectile Sphere
      const pGrad = ctx.createRadialGradient(px - 3, py - 3, 1, px, py, p.radius);
      pGrad.addColorStop(0, '#fcd34d');
      pGrad.addColorStop(1, '#b45309');
      ctx.beginPath();
      ctx.arc(px, py, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = pGrad;
      ctx.fill();

      // Check boundaries
      if (px < 0 || px > width || py < 0 || py > height) {
        state.projectiles.splice(i, 1);
        continue;
      }

      // Check Collisions
      let hit = false;
      for (let j = state.targets.length - 1; j >= 0; j--) {
        const t = state.targets[j];
        const dist = Math.hypot(px - t.x, py - t.y);
        
        if (dist < p.radius + t.radius) {
          hit = true;
          let isCorrectHit = false;
          if (state.mode === "standard") {
             isCorrectHit = t.text === state.currentQuestion.country[state.currentQuestion.propType].toUpperCase();
          } else {
             isCorrectHit = t.text === state.currentQuestion.correctAnswer.toUpperCase();
          }
          
          if (isCorrectHit) {
            state.correctHits++;
            state.levelCorrectCount++;
            state.combo++;
            if (state.combo > state.maxCombo) state.maxCombo = state.combo;
            
            const points = 10 * state.level * state.combo;
            state.score += points;
            createParticles(t.x, t.y, '#10b981'); // emerald
            
            state.floatingTexts.push({
              x: t.x, y: t.y,
              text: `RIGHT! +${points}${state.combo > 1 ? ' (Combo!)' : ''}`,
              color: '#10b981',
              life: 2.0,
              vy: -1
            });
            
            state.targets.splice(j, 1);
            advanceQuestion();
          } else {
            state.wrongHits++;
            state.combo = 0; // break combo
            t.laughTimer = 60; // Hit wrong target, make THIS specific monkey laugh!
            createParticles(t.x, t.y, '#ef4444'); // red
            state.score = Math.max(0, state.score - 10);
            
            state.floatingTexts.push({
              x: t.x, y: t.y,
              text: `WRONG! -10`,
              color: '#ef4444',
              life: 2.0,
              vy: -1
            });
            
            // Notice: we DO NOT splice the wrong target anymore.
            // It stays on screen so the monkey can ride it and laugh at you!
          }
          forceRender(); // to update UI score/lives
          break;
        }
      }
      
      if (hit) {
        state.projectiles.splice(i, 1);
      }
    }

    // Update & Draw Particles
    for (let i = state.particles.length - 1; i >= 0; i--) {
      const p = state.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;
      
      if (p.life <= 0) {
        state.particles.splice(i, 1);
      } else {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
    }

    // Update & Draw Floating Texts
    for (let i = state.floatingTexts.length - 1; i >= 0; i--) {
      const ft = state.floatingTexts[i];
      ft.y += ft.vy;
      ft.life -= 0.015;
      
      if (ft.life <= 0) {
        state.floatingTexts.splice(i, 1);
      } else {
        ctx.globalAlpha = Math.max(0, ft.life);
        ctx.fillStyle = ft.color;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.font = '900 24px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeText(ft.text, ft.x, ft.y);
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.globalAlpha = 1.0;
      }
    }

    // Draw Cannon 3D Base & Gun
    ctx.save();
    ctx.translate(centerX, centerY);
    
    // Base Shadow
    ctx.beginPath();
    ctx.arc(5, 5, 50, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fill();

    // Timer Ring
    ctx.beginPath();
    const timeRatio = Math.max(0, state.timeLeft) / 30;
    ctx.arc(0, 0, 62, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * timeRatio));
    ctx.strokeStyle = state.timeLeft > 10 ? '#10b981' : '#ef4444'; // green normally, red when < 10s
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Timer Text
    ctx.font = '900 16px Inter, sans-serif';
    ctx.fillStyle = state.timeLeft > 10 ? '#0f172a' : '#ef4444';
    ctx.fillText(Math.ceil(state.timeLeft) + "s", 0, 85);

    // Base Bottom Layer (Silver)
    ctx.beginPath();
    ctx.arc(0, 0, 50, 0, Math.PI * 2);
    ctx.fillStyle = '#cbd5e1';
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Gun Barrel (Rotated)
    ctx.save();
    ctx.rotate(state.gunAngle);
    
    // Barrel Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(35, -7, 45, 24);

    // Barrel Gradient (Silver/White)
    const barrelGrad = ctx.createLinearGradient(30, -12, 30, 12);
    barrelGrad.addColorStop(0, '#ffffff');
    barrelGrad.addColorStop(0.5, '#e2e8f0');
    barrelGrad.addColorStop(1, '#94a3b8');
    ctx.fillStyle = barrelGrad;
    
    // Draw barrel shape
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(30, -12, 45, 24, 4);
    } else {
      ctx.rect(30, -12, 45, 24);
    }
    ctx.fill();

    // Gun Hole
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.ellipse(75, 0, 4, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore(); // restore rotation

    // Top Dome of Base (Glossy White)
    const baseGrad = ctx.createRadialGradient(-10, -10, 5, 0, 0, 45);
    baseGrad.addColorStop(0, '#ffffff');
    baseGrad.addColorStop(1, '#94a3b8');
    ctx.beginPath();
    ctx.arc(0, 0, 42, 0, Math.PI * 2);
    ctx.fillStyle = baseGrad;
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Highlight on dome
    ctx.beginPath();
    ctx.ellipse(-15, -15, 12, 6, Math.PI / 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fill();

    // Central Question Info
    ctx.rotate(0); // Ensure text is upright
    if (state.currentQuestion) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const countryName = state.mode === "standard" ? state.currentQuestion.country.name : state.currentQuestion.questionText;
      
      // Scale down font if text is too long for the central dome
      let cFontSize = 26;
      ctx.font = `900 ${cFontSize}px Inter, sans-serif`;
      // Allow multi-line for custom questions if needed, or just shrink it a lot
      while (ctx.measureText(countryName).width > 72 && cFontSize > 10) {
        cFontSize--;
        ctx.font = `900 ${cFontSize}px Inter, sans-serif`;
      }
      
      // Draw thick white outline to make it pop from the silver base
      ctx.lineJoin = "round";
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#ffffff';
      
      // If custom question is still too long, we truncate
      let displayText = countryName;
      if (ctx.measureText(displayText).width > 80) {
         displayText = displayText.substring(0, 15) + "...";
      }

      ctx.strokeText(displayText, 0, -8);
      
      // Draw vibrant gradient text
      const textGrad = ctx.createLinearGradient(0, -22, 0, 4);
      textGrad.addColorStop(0, '#0ea5e9'); // sky-500
      textGrad.addColorStop(1, '#1d4ed8'); // blue-700
      ctx.fillStyle = textGrad;
      ctx.fillText(displayText, 0, -8);
      // Subtitle is removed; it is now displayed in the top banner
    }
    
    ctx.restore();

    requestRef.current = requestAnimationFrame(updateGame);
  }, []);

  useEffect(() => {
    // Start loop
    requestRef.current = requestAnimationFrame(updateGame);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [updateGame]);

  const state = gameRef.current;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-blue-100 to-emerald-100 flex flex-col items-center pt-24 pb-10 px-4 select-none relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-400/20 rounded-full blur-[100px]" />

      <div className="max-w-5xl w-full relative z-10 flex flex-col items-center">
        
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-8 bg-white/60 p-4 rounded-2xl border border-white/50 backdrop-blur-md shadow-lg">
          <Link href="/games" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors bg-white/80 px-4 py-2 rounded-xl shadow-sm">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold">Back</span>
          </Link>
          
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-amber-600 bg-amber-100 px-4 py-2 rounded-xl border border-amber-200 shadow-sm">
              <Trophy className="w-5 h-5" />
              <span className="font-black text-xl">{state.score}</span>
            </div>
            
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-100 px-4 py-2 rounded-xl border border-emerald-200 shadow-sm">
              <span className="font-bold text-sm uppercase tracking-wider">Correct</span>
              <span className="font-black text-xl">{state.levelCorrectCount}/5+</span>
            </div>
            
            <div className="flex items-center gap-2 text-blue-600 bg-blue-100 px-4 py-2 rounded-xl border border-blue-200 shadow-sm">
              <span className="font-bold text-sm uppercase tracking-wider">Level</span>
              <span className="font-black text-xl">{state.level}</span>
            </div>

            <div className="flex items-center gap-2 text-fuchsia-600 bg-fuchsia-100 px-4 py-2 rounded-xl border border-fuchsia-200 shadow-sm">
              <span className="font-bold text-sm uppercase tracking-wider">Combo</span>
              <span className="font-black text-xl">{state.combo}x</span>
            </div>
          </div>
        </div>

        {/* Question Banner (HTML) */}
        {state.gameState === "playing" && state.currentQuestion && (() => {
          let questionText = "";
          if (state.mode === "standard") {
            const countryName = state.currentQuestion.country.name;
            const typeStr = state.currentQuestion.propType.charAt(0).toUpperCase() + state.currentQuestion.propType.slice(1);
            questionText = `${countryName} ${typeStr}`;
            if (['animal', 'bird', 'emblem', 'flower', 'sport'].includes(state.currentQuestion.propType)) {
              questionText = `${countryName} National ${typeStr}`;
            } else if (state.currentQuestion.propType === 'landmark') {
              questionText = `${countryName} Famous ${typeStr}`;
            } else if (state.currentQuestion.propType === 'language') {
              questionText = `${countryName} Official ${typeStr}`;
            }
          } else {
            questionText = state.currentQuestion.questionText;
          }
          return (
            <div className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-2xl border-4 border-sky-400 p-4 mb-6 shadow-xl text-center">
              <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-wide">
                {questionText}
              </h2>
            </div>
          );
        })()}

        {/* Game Container */}
        <div 
          className="relative w-full aspect-square bg-white/40 rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.1)] border-8 border-white/60 backdrop-blur-sm flex items-center justify-center overflow-hidden"
          style={{ maxWidth: 'min(100%, 65vh)' }}
        >
          
          <canvas
            ref={canvasRef}
            width={800}
            height={800}
            className="w-full h-full cursor-crosshair rounded-full"
            onMouseMove={handleMouseMove}
            onClick={handleMouseClick}
          />

          {/* Overlays */}
          {state.gameState === "start" && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center rounded-full z-10 pointer-events-auto">
              <Crosshair className="w-16 h-16 text-sky-500 mb-4 animate-pulse drop-shadow-md" />
              <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-2 tracking-tight drop-shadow-sm">Country Shooter</h1>
              <p className="text-slate-600 font-medium text-lg max-w-sm mb-6">
                Aim at the correct property. Test your knowledge! Select a mode below.
              </p>
              
              <div className="flex gap-4 mb-6 w-full max-w-md">
                <button 
                  onClick={() => setSelectedMode("standard")}
                  className={`flex-1 py-2 px-4 rounded-xl font-bold border-2 transition-all ${selectedMode === "standard" ? "bg-sky-100 border-sky-500 text-sky-700 shadow-md" : "bg-white border-slate-200 text-slate-500 hover:border-sky-300"}`}
                >
                  Standard Game
                </button>
                <button 
                  onClick={() => setSelectedMode("custom")}
                  className={`flex-1 py-2 px-4 rounded-xl font-bold border-2 transition-all ${selectedMode === "custom" ? "bg-emerald-100 border-emerald-500 text-emerald-700 shadow-md" : "bg-white border-slate-200 text-slate-500 hover:border-emerald-300"}`}
                >
                  Custom Exam
                </button>
              </div>

              {selectedMode === "standard" ? (
                <div className="mb-6 w-64 text-left animate-in fade-in slide-in-from-bottom-2">
                  <label className="block text-slate-700 font-bold mb-2 uppercase text-sm tracking-wider text-center">Category</label>
                  <select 
                    className="w-full bg-white border-2 border-sky-300 rounded-xl px-4 py-3 text-slate-800 font-bold outline-none focus:border-sky-500 shadow-sm transition-colors cursor-pointer appearance-none text-center"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {PROPERTY_TYPES.map(pt => (
                      <option key={pt} value={pt}>{pt.charAt(0).toUpperCase() + pt.slice(1)}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="mb-6 w-64 text-left animate-in fade-in slide-in-from-bottom-2">
                  <label className="block text-emerald-700 font-bold mb-2 uppercase text-sm tracking-wider text-center flex items-center justify-center gap-1">
                    <BookOpen className="w-4 h-4" /> Assigned Exam
                  </label>
                  {assignedExams.length > 0 ? (
                    <select 
                      className="w-full bg-white border-2 border-emerald-300 rounded-xl px-4 py-3 text-emerald-800 font-bold outline-none focus:border-emerald-500 shadow-sm transition-colors cursor-pointer appearance-none text-center"
                      value={selectedExamId}
                      onChange={(e) => setSelectedExamId(e.target.value)}
                    >
                      {assignedExams.map(exam => (
                        <option key={exam.id} value={exam.id}>{exam.questionSet.name}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-center text-rose-500 font-bold bg-rose-50 p-3 rounded-xl border border-rose-200 text-sm">
                      No exams assigned to you yet.
                    </div>
                  )}
                </div>
              )}

              <button 
                onClick={startCountdown}
                disabled={selectedMode === "custom" && assignedExams.length === 0}
                className={`text-white font-bold text-xl px-12 py-4 rounded-full transition-all hover:-translate-y-1 ${
                  selectedMode === "custom" && assignedExams.length === 0 
                  ? "bg-slate-300 cursor-not-allowed" 
                  : "bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 shadow-[0_10px_25px_rgba(56,189,248,0.4)] hover:shadow-[0_15px_35px_rgba(56,189,248,0.6)]"
                }`}
              >
                Play Now
              </button>
            </div>
          )}

          {state.gameState === "countdown" && (
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center rounded-full">
              <h1 className="text-9xl font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] animate-bounce">
                {state.countdownValue > 0 ? state.countdownValue : "GO!"}
              </h1>
            </div>
          )}
          
        </div>

        {/* Centered Game Over / Level Up Scorecard */}
        {(state.gameState === "gameover" || state.gameState === "levelup") && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white/95 backdrop-blur-xl flex flex-col items-center p-8 text-center rounded-3xl border-4 border-white shadow-[0_20px_60px_rgba(0,0,0,0.25)] max-w-md w-[90%] animate-in zoom-in-95 duration-500">
              <h2 className={`text-4xl font-black mb-6 drop-shadow-sm ${state.gameState === "levelup" ? 'text-emerald-600' : 'text-rose-600'}`}>
                {state.gameState === "levelup" ? "LEVEL COMPLETE!" : "LEVEL FAILED!"}
              </h2>
              
              <div className="grid grid-cols-2 gap-4 w-full mb-8">
                <div className="bg-sky-50 rounded-xl p-3 border border-sky-100 shadow-inner">
                  <div className="text-sky-500 font-bold text-sm uppercase">Total Score</div>
                  <div className="text-sky-700 font-black text-3xl">{state.score}</div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 shadow-inner">
                  <div className="text-emerald-500 font-bold text-sm uppercase">Current Level</div>
                  <div className="text-emerald-700 font-black text-3xl">{state.level}</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 shadow-inner">
                  <div className="text-amber-500 font-bold text-sm uppercase">Correct Answers</div>
                  <div className="text-amber-700 font-black text-3xl">{state.levelCorrectCount}/10</div>
                </div>
                <div className="bg-rose-50 rounded-xl p-3 border border-rose-100 shadow-inner">
                  <div className="text-rose-500 font-bold text-sm uppercase">Accuracy</div>
                  <div className="text-rose-700 font-black text-3xl">
                    {Math.round((state.levelCorrectCount / 10) * 100)}%
                  </div>
                </div>
              </div>
  
              <button 
                onClick={state.gameState === "levelup" ? continueNextLevel : startCountdown}
                className={`flex items-center gap-3 bg-gradient-to-r text-white font-bold text-xl px-10 py-4 rounded-full transition-all hover:-translate-y-1 ${
                  state.gameState === "levelup"
                    ? "from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 shadow-[0_10px_25px_rgba(52,211,153,0.4)]"
                    : "from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 shadow-[0_10px_25px_rgba(244,63,94,0.4)]"
                }`}
              >
                {state.gameState === "levelup" ? <Play className="w-6 h-6" /> : <RefreshCw className="w-6 h-6" />}
                {state.gameState === "levelup" ? "Next Level" : "Play Again"}
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 text-slate-500 text-center max-w-xl bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/60 shadow-sm">
          <p className="font-bold text-sm">
            Use your mouse or tap to aim and shoot. Don't let the targets complete the full circle! 
            Shooting the wrong target costs you 10 points and breaks your combo.
          </p>
        </div>

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