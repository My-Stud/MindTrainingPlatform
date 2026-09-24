"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, ChevronRight } from "lucide-react";

// 10 Distinct levels with beautiful textures and crazy movement patterns!
const LEVEL_CONFIGS = [
    { name: 'Wood', pattern: 'horizontal', speed: 0.02, texture: 'wicker', colors: { bg1: 'bg-[#3e2723]', bg2: 'bg-[#795548]', border: 'border-[#4e342e]' } },
    { name: 'Steel', pattern: 'zigzag', speed: 0.025, ampY: 15, freqY: 1.5, texture: 'metal', colors: { bg1: 'bg-slate-700', bg2: 'bg-gradient-to-b from-slate-400 to-slate-500', border: 'border-slate-600' } },
    { name: 'Bronze', pattern: 'zigzag', speed: 0.06, ampY: 10, freqY: 0.8, texture: 'metal', colors: { bg1: 'bg-orange-900', bg2: 'bg-gradient-to-b from-orange-400 to-orange-600', border: 'border-orange-800' } },
    { name: 'Jade', pattern: 'circle', speed: 0.018, texture: 'crystal', colors: { bg1: 'bg-emerald-900', bg2: 'bg-gradient-to-b from-emerald-400 to-emerald-600', border: 'border-emerald-800' } },
    { name: 'Amethyst', pattern: 'figure8', speed: 0.068, ampY: 20, offsetY: -20, freqX: 0.5, freqY: 1, texture: 'crystal', colors: { bg1: 'bg-purple-900', bg2: 'bg-gradient-to-b from-purple-400 to-purple-600', border: 'border-purple-800' } },
    { name: 'Ruby', pattern: 'pendulum', speed: 0.07, texture: 'crystal', colors: { bg1: 'bg-rose-900', bg2: 'bg-gradient-to-b from-rose-500 to-rose-700', border: 'border-rose-800' } },
    { name: 'Gold', pattern: 'erratic', speed: 0.03, texture: 'metal', colors: { bg1: 'bg-yellow-900', bg2: 'bg-gradient-to-b from-yellow-300 to-yellow-500', border: 'border-yellow-700' } },
    { name: 'Diamond', pattern: 'circle', speed: 0.035, texture: 'crystal', colors: { bg1: 'bg-cyan-900', bg2: 'bg-gradient-to-b from-cyan-300 to-blue-500', border: 'border-blue-700' } },
    { name: 'Obsidian', pattern: 'zigzag', speed: 0.04, ampY: 20, freqY: 2.5, texture: 'metal', colors: { bg1: 'bg-black', bg2: 'bg-gradient-to-b from-gray-700 to-gray-900', border: 'border-gray-800' } },
    { name: 'Magma', pattern: 'figure8', speed: 0.05, texture: 'wicker', colors: { bg1: 'bg-red-950', bg2: 'bg-gradient-to-b from-red-500 to-orange-500', border: 'border-red-800' } },
];

export default function EggToss() {
    const gameRef = useRef({
        gameState: "start", 
        level: 1,
        totalScore: 0,
        levelScore: 0,
        eggsRemaining: 10,
        basketX: 50,
        basketYOffset: 0,
        basketTime: 0,
        erraticTarget: 50,
        erraticTargetY: 0,
        eggY: 15,
        eggState: "idle", 
        eggVelocity: 0,
        eggOffsetX: 0, 
    });

    const [bestScore, setBestScore] = useState(0);
    const [, setRenderTick] = useState(0); 
    
    const basketDir = useRef(1); 
    const requestRef = useRef(null);
    const lastTime = useRef(performance.now());

    const BASKET_BASE_Y = 70; 
    const BASKET_WIDTH = 25; 
    const JUMP_VELOCITY = 0.185; 
    const GRAVITY = 0.0002; 

    const forceRender = () => setRenderTick(t => t + 1);

    const updateGame = useCallback((time) => {
        const state = gameRef.current;
        if (state.gameState !== "playing") return;
        
        const deltaTime = time - lastTime.current;
        lastTime.current = time;

        const levelIndex = (state.level - 1) % LEVEL_CONFIGS.length;
        const config = LEVEL_CONFIGS[levelIndex];
        const speedMultiplier = 1 + Math.floor((state.level - 1) / LEVEL_CONFIGS.length) * 0.2;
        const currentSpeed = config.speed * speedMultiplier;
        
        state.basketTime += deltaTime;
        
        const baseSpeedRatio = config.speed / 0.02; 
        const scaledTime = state.basketTime * 0.001 * baseSpeedRatio * speedMultiplier; 
        
        const limit = 100 - (BASKET_WIDTH / 2);
        const lowerLimit = BASKET_WIDTH / 2;
        const amplitudeX = 50 - (BASKET_WIDTH / 2);
        
        // 1. Update Basket Movement (10 Unique Patterns)
        if (['horizontal', 'zigzag', 'vertical_bob'].includes(config.pattern)) {
            state.basketX += currentSpeed * deltaTime * basketDir.current;
            if (state.basketX >= limit) {
                basketDir.current = -1;
                state.basketX = limit;
            } else if (state.basketX <= lowerLimit) {
                basketDir.current = 1;
                state.basketX = lowerLimit;
            }
        }
        
        if (config.pattern === 'horizontal') {
            state.basketYOffset = 0;
        } else if (config.pattern === 'zigzag') {
            const freq = config.freqY || 1.5;
            const amp = config.ampY || 15;
            const yPhase = (scaledTime * freq) % 2; 
            if (yPhase < 1) state.basketYOffset = -amp + (amp * 2) * yPhase; 
            else state.basketYOffset = amp - (amp * 2) * (yPhase - 1); 
        } else if (config.pattern === 'vertical_bob') {
            state.basketYOffset = 20 * Math.sin(scaledTime * Math.PI * 2); 
        } else if (config.pattern === 'circle') {
            state.basketX = 50 + amplitudeX * Math.cos(scaledTime * Math.PI); 
            state.basketYOffset = 20 * Math.sin(scaledTime * Math.PI);
        } else if (config.pattern === 'figure8') {
            const freqX = config.freqX || 1;
            const freqY = config.freqY || 2;
            const ampY = config.ampY || 20;
            const offsetY = config.offsetY || 0;
            state.basketX = 50 + amplitudeX * Math.sin(scaledTime * Math.PI * freqX); 
            state.basketYOffset = offsetY + ampY * Math.sin(scaledTime * Math.PI * freqY); 
        } else if (config.pattern === 'pendulum') {
            const angle = Math.sin(scaledTime * Math.PI) * (Math.PI / 3); 
            state.basketX = 50 + 40 * Math.sin(angle);
            state.basketYOffset = -25 * (1 - Math.cos(angle)); 
        } else if (config.pattern === 'erratic') {
            const diffX = state.erraticTarget - state.basketX;
            const diffY = state.erraticTargetY - state.basketYOffset;
            
            if (Math.abs(diffX) < 1 && Math.abs(diffY) < 1) {
                state.erraticTarget = lowerLimit + Math.random() * (limit - lowerLimit);
                state.erraticTargetY = -20 + Math.random() * 40; 
            }
            const moveX = Math.sign(diffX) * currentSpeed * 2.5 * deltaTime;
            const moveY = Math.sign(diffY) * currentSpeed * 2.5 * deltaTime;
            
            state.basketX = Math.abs(moveX) > Math.abs(diffX) ? state.erraticTarget : state.basketX + moveX;
            state.basketYOffset = Math.abs(moveY) > Math.abs(diffY) ? state.erraticTargetY : state.basketYOffset + moveY;
        }

        const currentBasketY = BASKET_BASE_Y + state.basketYOffset;

        // 2. Update Egg Position
        if (state.eggState === "flying") {
            state.eggVelocity -= GRAVITY * deltaTime;
            const prevY = state.eggY;
            state.eggY += state.eggVelocity * deltaTime;
            
            if (state.eggVelocity < 0 && prevY > currentBasketY + 4 && state.eggY <= currentBasketY + 4) {
                const distance = Math.abs(state.basketX - 50);
                if (distance <= BASKET_WIDTH / 2 + 5) {
                    state.eggState = "falling_in_basket";
                    state.eggOffsetX = 50 - state.basketX;
                }
            }
            
            if (state.eggState === "flying" && state.eggY < -10) {
                state.eggState = "cracked";
                state.eggY = -10;
                
                setTimeout(() => {
                    if (state.eggsRemaining <= 0) {
                        gameRef.current.gameState = state.levelScore >= 5 ? "levelup" : "gameover";
                        forceRender();
                    } else if (gameRef.current.gameState === "playing") {
                        gameRef.current.eggY = 15;
                        gameRef.current.eggVelocity = 0;
                        gameRef.current.eggState = "idle";
                    }
                }, 800);
            }
        } else if (state.eggState === "falling_in_basket") {
            state.eggVelocity -= GRAVITY * deltaTime;
            state.eggY += state.eggVelocity * deltaTime;
            
            state.eggOffsetX *= 0.85;
            
            if (state.eggY <= currentBasketY + 3) {
                state.eggY = currentBasketY + 3;
                state.eggVelocity = 0;
                state.eggState = "scored";
                state.eggOffsetX = 0; 
                
                state.levelScore += 1;
                state.totalScore += 1;
                
                setTimeout(() => {
                    if (state.eggsRemaining <= 0) {
                        gameRef.current.gameState = state.levelScore >= 5 ? "levelup" : "gameover";
                        forceRender();
                    } else if (gameRef.current.gameState === "playing") {
                        gameRef.current.eggY = 15;
                        gameRef.current.eggVelocity = 0;
                        gameRef.current.eggState = "idle";
                    }
                }, 400);
            }
        }

        forceRender(); 
        requestRef.current = requestAnimationFrame(updateGame);
    }, []);

    useEffect(() => {
        if (gameRef.current.gameState === "playing") {
            lastTime.current = performance.now();
            requestRef.current = requestAnimationFrame(updateGame);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [gameRef.current.gameState, updateGame]);

    const tossEgg = useCallback(() => {
        const state = gameRef.current;
        if (state.gameState === "playing" && state.eggState === "idle" && state.eggsRemaining > 0) {
            state.eggState = "flying";
            state.eggVelocity = JUMP_VELOCITY;
            state.eggsRemaining -= 1;
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === "Space") {
                e.preventDefault();
                tossEgg();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [tossEgg]);

    const startGame = (resetLevel = true) => {
        gameRef.current = {
            gameState: "playing",
            level: resetLevel ? 1 : gameRef.current.level + 1,
            totalScore: resetLevel ? 0 : gameRef.current.totalScore,
            levelScore: 0,
            eggsRemaining: 10,
            basketX: 50,
            basketYOffset: 0,
            basketTime: 0,
            erraticTarget: 50,
            erraticTargetY: 0,
            eggY: 15,
            eggState: "idle",
            eggVelocity: 0,
            eggOffsetX: 0,
        };
        basketDir.current = 1;
        forceRender();
    };

    useEffect(() => {
        if (gameRef.current.gameState === "gameover") {
            if (gameRef.current.totalScore > bestScore) {
                setBestScore(gameRef.current.totalScore);
            }
        }
    }, [gameRef.current.gameState, gameRef.current.totalScore, bestScore]);

    const state = gameRef.current;
    const levelIndex = (state.level - 1) % LEVEL_CONFIGS.length;
    const config = LEVEL_CONFIGS[levelIndex];
    const currentBasketY = BASKET_BASE_Y + state.basketYOffset;
    
    let currentEggX = 50;
    let currentEggY = state.eggY;
    if (state.eggState === "scored") {
        currentEggX = state.basketX;
        currentEggY = currentBasketY + 3; 
    } else if (state.eggState === "falling_in_basket") {
        currentEggX = state.basketX + (state.eggOffsetX || 0);
    }

    let eggZ = 'z-20'; 
    if (state.eggState === 'flying' && state.eggVelocity > 0) {
        eggZ = 'z-40';
    } else if (state.eggState === 'cracked') {
        eggZ = 'z-40';
    }

    return (
        <div className="min-h-screen bg-green-950 text-slate-100 p-4 sm:p-8 font-sans select-none flex flex-col items-center">
            <div className="w-full max-w-2xl mb-6 flex items-center justify-between">
                <Link href="/games" className="inline-flex items-center text-green-400 hover:text-green-300 font-medium transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Games
                </Link>
                <div className="flex gap-3 items-baseline">
                    <div className="text-xl font-bold text-amber-400">Level {state.level}: {config.name}</div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-green-100 drop-shadow-md">Egg Toss</h1>
                </div>
            </div>

            <div 
                className="relative h-[70vh] sm:h-[600px] w-full max-w-2xl rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden border-8 border-[#3e2723] cursor-pointer touch-none bg-cover bg-center"
                style={{ backgroundImage: "url('/leafy_bg.png')" }}
                onClick={tossEgg}
            >
                {/* HUD */}
                <div className="absolute top-6 left-6 z-40">
                    <div className="bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 shadow-lg flex items-center gap-4">
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider">Lvl Score</span>
                            <span className="text-2xl font-black text-white drop-shadow-md">{state.levelScore}/10</span>
                        </div>
                        <div className="w-px h-8 bg-white/20" />
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider">Total</span>
                            <span className="text-2xl font-black text-yellow-400 drop-shadow-md">{state.totalScore}</span>
                        </div>
                    </div>
                </div>

                {/* Overlays */}
                {state.gameState === "start" && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-50 transition-all duration-300">
                        <div className="bg-[#4e342e]/90 p-10 rounded-[2.5rem] shadow-2xl text-center max-w-sm w-full mx-4 border-4 border-[#3e2723]">
                            <div className="w-20 h-24 bg-white rounded-[50%_50%_50%_50%/60%_60%_40%_40%] mx-auto mb-6 shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.2)]" />
                            <h2 className="text-4xl font-black mb-3 text-white">Egg Toss</h2>
                            <p className="text-amber-200 mb-8 font-medium">
                                Toss your 10 eggs per level. Catch at least 5 to advance!
                            </p>
                            <button 
                                onClick={(e) => { e.stopPropagation(); startGame(true); }}
                                className="w-full bg-green-600 hover:bg-green-500 text-white font-black text-xl py-5 px-8 rounded-3xl transition-all shadow-[0_0_20px_rgba(22,163,74,0.4)] hover:shadow-[0_0_30px_rgba(22,163,74,0.6)]"
                            >
                                START CAMPAIGN
                            </button>
                        </div>
                    </div>
                )}

                {state.gameState === "levelup" && (
                    <div className="absolute inset-0 bg-blue-900/80 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-in fade-in duration-300">
                        <div className="bg-black/40 p-10 rounded-[2.5rem] shadow-2xl text-center max-w-sm w-full mx-4 border border-white/10">
                            <h2 className="text-5xl font-black mb-2 text-white drop-shadow-lg tracking-widest">LEVEL {state.level} CLEAR!</h2>
                            <p className="text-2xl text-blue-200 mb-8 font-bold">You caught <span className="text-white text-3xl mx-2">{state.levelScore}</span> eggs</p>
                            <button 
                                onClick={(e) => { e.stopPropagation(); startGame(false); }}
                                className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xl py-5 px-10 rounded-3xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-3 mx-auto"
                            >
                                NEXT LEVEL
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                )}

                {state.gameState === "gameover" && (
                    <div className="absolute inset-0 bg-red-950/80 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-in fade-in duration-300">
                        <div className="text-center">
                            <div className="text-7xl mb-6 animate-bounce">🍳</div>
                            <h2 className="text-5xl font-black mb-2 text-white drop-shadow-lg tracking-widest">GAME OVER</h2>
                            <p className="text-xl text-red-200 font-medium">You needed 5 eggs to pass Level {state.level}.</p>
                            <p className="text-2xl text-red-300 mb-10 font-bold">Total Score: <span className="text-white text-4xl ml-2">{state.totalScore}</span></p>
                            <button 
                                onClick={(e) => { e.stopPropagation(); startGame(true); }}
                                className="bg-[#795548] hover:bg-[#5d4037] text-white font-black text-xl py-5 px-10 rounded-3xl transition-all shadow-[0_0_20px_rgba(121,85,72,0.4)] flex items-center justify-center gap-3 mx-auto"
                            >
                                <RefreshCw className="w-6 h-6" />
                                TRY AGAIN
                            </button>
                        </div>
                    </div>
                )}

                {/* Basket Back */}
                <div 
                    className="absolute h-24 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
                    style={{ bottom: `${currentBasketY}%`, left: `${state.basketX}%`, width: `${BASKET_WIDTH}%` }}
                >
                    <div className={`absolute top-0 w-full h-12 ${config.colors.bg1} rounded-[50%] shadow-[inset_0_-10px_20px_rgba(0,0,0,0.8)]`} />
                </div>

                {/* Egg */}
                {state.gameState === "playing" && (
                    <div 
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] 
                            ${state.eggState === 'cracked' ? 'bg-orange-200 border-4 border-orange-300 scale-y-50 mt-8 w-16 h-10' : 'bg-white shadow-[-8px_-8px_20px_rgba(0,0,0,0.15)_inset] w-12 h-16'}
                            ${eggZ}`}
                        style={{ left: `${currentEggX}%`, bottom: `${currentEggY}%` }}
                    />
                )}

                {/* Basket Front with Beautiful Textures */}
                <div 
                    className="absolute h-24 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                    style={{ bottom: `${currentBasketY}%`, left: `${state.basketX}%`, width: `${BASKET_WIDTH}%` }}
                >
                    <div className={`absolute top-6 w-full h-18 ${config.colors.bg2} rounded-b-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.6),inset_0_4px_10px_rgba(255,255,255,0.3)] border-b-8 ${config.colors.border} overflow-hidden`}>
                        {config.texture === 'wicker' && (
                            <div className="absolute inset-0 flex flex-wrap opacity-30 mix-blend-overlay">
                                {[...Array(24)].map((_, i) => (
                                    <div key={i} className={`w-6 h-6 border-2 ${config.colors.border} transform rotate-45 scale-150`} />
                                ))}
                            </div>
                        )}
                        {config.texture === 'metal' && (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 -translate-x-1/2 opacity-50" />
                                <div className="absolute top-0 w-full h-2 bg-white/20" />
                            </>
                        )}
                        {config.texture === 'crystal' && (
                            <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.5) 10px, rgba(255,255,255,0.5) 20px)' }} />
                        )}
                    </div>
                </div>
                
                {/* Base UI */}
                <div className="absolute bottom-0 w-full h-[15%] bg-gradient-to-t from-green-950 to-green-900/0 z-10 pointer-events-none flex items-end pb-4">
                     {state.eggState === 'idle' && state.gameState === "playing" && (
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-green-300 font-bold uppercase tracking-widest text-sm animate-pulse whitespace-nowrap shadow-lg">
                            Tap to Toss
                        </div>
                     )}
                     
                     <div className="absolute bottom-4 right-6 flex items-center gap-3">
                         <span className="text-xs font-bold text-green-200 uppercase tracking-widest opacity-80 bg-black/30 px-2 py-1 rounded-lg">Eggs</span>
                         <div className="flex gap-1.5 bg-black/30 px-3 py-2 rounded-xl backdrop-blur-sm border border-white/5">
                             {[...Array(10)].map((_, i) => (
                                 <div 
                                    key={i} 
                                    className={`w-3.5 h-5 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] transition-all duration-300 ${i < state.eggsRemaining ? 'bg-white shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.2)] scale-100' : 'bg-black/50 scale-75 opacity-30'}`} 
                                 />
                             ))}
                         </div>
                     </div>
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