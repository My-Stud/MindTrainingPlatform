"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Trophy, Heart, Palette, Play, X, Check } from "lucide-react";

// Colors for the Stroop effect
// Using literal tailwind text color classes for rendering
const COLORS = [
    { name: "RED", textClass: "text-red-500", hex: "#ef4444" },
    { name: "BLUE", textClass: "text-blue-500", hex: "#3b82f6" },
    { name: "GREEN", textClass: "text-green-500", hex: "#22c55e" },
    { name: "YELLOW", textClass: "text-yellow-500", hex: "#eab308" },
    { name: "PURPLE", textClass: "text-purple-500", hex: "#a855f7" },
    { name: "ORANGE", textClass: "text-orange-500", hex: "#f97316" },
];

export default function ColorClash() {
    const [gameState, setGameState] = useState("start"); // start, playing, result
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [timeLeft, setTimeLeft] = useState(45); // 45 seconds per game

    const [wordText, setWordText] = useState(null); // The string to display
    const [wordColor, setWordColor] = useState(null); // The actual color class to display it in
    const [isMatching, setIsMatching] = useState(false); // Does the text say the actual color?

    const timerRef = useRef(null);

    const generateNextWord = useCallback(() => {
        // 50% chance of matching meaning and color
        const shouldMatch = Math.random() < 0.5;
        setIsMatching(shouldMatch);

        const textObj = COLORS[Math.floor(Math.random() * COLORS.length)];
        setWordText(textObj.name);

        if (shouldMatch) {
            setWordColor(textObj.textClass);
        } else {
            let colorObj;
            do {
                colorObj = COLORS[Math.floor(Math.random() * COLORS.length)];
            } while (colorObj.name === textObj.name);
            setWordColor(colorObj.textClass);
        }
    }, []);

    const startGame = () => {
        setGameState("playing");
        setScore(0);
        setLives(3);
        setTimeLeft(45);
        generateNextWord();
    };

    useEffect(() => {
        if (gameState === "playing") {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        setGameState("result");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [gameState]);

    const handleChoice = (userSaysMatch) => {
        if (gameState !== "playing") return;

        if (userSaysMatch === isMatching) {
            // Correct
            setScore(prev => prev + 100);
        } else {
            // Wrong
            setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                    clearInterval(timerRef.current);
                    setGameState("result");
                }
                return newLives;
            });
        }

        generateNextWord();
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <Link href="/games" className="inline-flex items-center text-text-muted hover:text-primary-600 font-medium transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Games
                </Link>

                {gameState === "playing" && (
                    <div className="flex items-center gap-6 bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2">
                            <Palette className="w-5 h-5 text-accent-500" />
                            <span className="font-extrabold text-foreground tracking-widest text-lg">0:{timeLeft.toString().padStart(2, '0')}</span>
                        </div>
                        <div className="w-px h-6 bg-gray-200" />
                        <div className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-primary-500" />
                            <span className="font-extrabold text-foreground text-lg">{score}</span>
                        </div>
                        <div className="w-px h-6 bg-gray-200" />
                        <div className="flex items-center gap-1">
                            {[...Array(3)].map((_, i) => (
                                <Heart
                                    key={i}
                                    className={`w-5 h-5 ${i < lives ? "fill-red-500 text-red-500" : "fill-gray-100 text-gray-200"} transition-all`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col items-center justify-center min-h-[500px]">
                {gameState === "start" && (
                    <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm text-center max-w-lg w-full relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                        <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
                            <div className="absolute inset-0 border-2 border-primary-300 rounded-2xl animate-ping opacity-40" />
                            <Palette className="w-10 h-10 text-primary-600" />
                        </div>

                        <h1 className="text-3xl font-extrabold mb-4 text-foreground">Color Clash</h1>
                        <p className="text-text-muted mb-8 leading-relaxed font-medium">
                            Does the <strong className="text-foreground">MEANING</strong> of the word match its <strong className="text-foreground">INK COLOR</strong>?
                            Overcome cognitive interference as fast as you can.
                        </p>

                        <button
                            onClick={startGame}
                            className="w-full py-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-extrabold text-lg shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-3 group"
                        >
                            Start Challenge
                            <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                )}

                {gameState === "playing" && (
                    <div className="flex flex-col items-center w-full max-w-lg">

                        <div className="mb-12 w-full text-center py-20 bg-white rounded-[3rem] shadow-xl border border-gray-100">
                            <span style={{ fontSize: 'clamp(4rem, 10vw, 8rem)' }} className={`font-black tracking-tighter uppercase drop-shadow-sm ${wordColor}`}>
                                {wordText}
                            </span>
                        </div>

                        <div className="flex gap-4 w-full">
                            <button
                                onClick={() => handleChoice(false)}
                                className="flex-[2] py-6 rounded-2xl bg-white border-2 border-red-100 hover:border-red-500 hover:bg-red-50 text-red-600 font-black text-xl transition-all shadow-sm flex items-center justify-center gap-3 group"
                            >
                                <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                NO
                            </button>
                            <button
                                onClick={() => handleChoice(true)}
                                className="flex-[2] py-6 rounded-2xl bg-white border-2 border-accent-100 hover:border-accent-500 hover:bg-accent-50 text-accent-600 font-black text-xl transition-all shadow-sm flex items-center justify-center gap-3 group"
                            >
                                <Check className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                YES
                            </button>
                        </div>
                    </div>
                )}

                {gameState === "result" && (
                    <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-lg text-center max-w-md w-full relative">
                        <div className="w-24 h-24 bg-accent-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trophy className="w-12 h-12 text-accent-500" />
                        </div>

                        <h2 className="text-3xl font-extrabold mb-2 text-foreground">Time's Up!</h2>
                        <p className="text-text-muted mb-8 font-medium">You survived {45 - timeLeft} seconds</p>

                        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                            <p className="text-sm text-text-muted uppercase tracking-widest font-extrabold mb-2">Final Score</p>
                            <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-500 to-accent-600">
                                {score}
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <Link
                                href="/games"
                                className="flex-1 py-4 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-foreground font-bold transition-colors border border-transparent"
                            >
                                Menu
                            </Link>
                            <button
                                onClick={startGame}
                                className="flex-[2] py-4 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold transition-colors shadow-md flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Play Again
                            </button>
                        </div>
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