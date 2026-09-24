"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Trophy, Heart, Zap, Play, X, Check } from "lucide-react";

// The set of symbols to use
const SYMBOLS = ["▲", "●", "■", "★", "✦", "♦", "✖"];

export default function SpeedMatch() {
    const [gameState, setGameState] = useState("start"); // start, playing, result
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per game

    const [currentSymbol, setCurrentSymbol] = useState(null);
    const [previousSymbol, setPreviousSymbol] = useState(null);
    const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null

    const timerRef = useRef(null);

    // Pick a new symbol, sometimes forcing a match
    const generateNextSymbol = useCallback((prev) => {
        // 30% chance to force a match if there IS a previous symbol
        const forceMatch = prev && Math.random() < 0.3;

        if (forceMatch) {
            setCurrentSymbol(prev);
        } else {
            let nextSym;
            do {
                nextSym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            } while (nextSym === prev); // Ensure it's not a match by accident if we didn't force one
            setCurrentSymbol(nextSym);
        }
    }, []);

    const startGame = () => {
        setGameState("playing");
        setScore(0);
        setLives(3);
        setTimeLeft(60);
        setFeedback(null);
        setCurrentSymbol(null);
        setPreviousSymbol(null);

        // Initial start
        const firstSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        setCurrentSymbol(firstSymbol);
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

    const handleChoice = (isMatch) => {
        if (gameState !== "playing" || !previousSymbol) return; // Can't choose on the very first symbol

        const actualMatch = currentSymbol === previousSymbol;

        if (isMatch === actualMatch) {
            // Correct
            setScore(prev => prev + 50);
            setFeedback("correct");
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
            setFeedback("wrong");
        }

        setTimeout(() => setFeedback(null), 300);

        // Shift symbols
        setPreviousSymbol(currentSymbol);
        generateNextSymbol(currentSymbol);
    };

    const handleStartSequence = () => {
        // The user clicks "Next" on the first symbol to get the sequence going
        setPreviousSymbol(currentSymbol);
        generateNextSymbol(currentSymbol);
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
                            <Zap className="w-5 h-5 text-accent-500" />
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
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-100/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                        <div className="w-20 h-20 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
                            <div className="absolute inset-0 border-2 border-accent-300 rounded-2xl animate-ping opacity-40" />
                            <Zap className="w-10 h-10 text-accent-600" />
                        </div>

                        <h1 className="text-3xl font-extrabold mb-4 text-foreground">Speed Match</h1>
                        <p className="text-text-muted mb-8 leading-relaxed font-medium">
                            Does the current symbol match the one that appeared <strong className="text-foreground">immediately before it</strong>?
                            Process information quickly and accurately.
                        </p>

                        <button
                            onClick={startGame}
                            className="w-full py-4 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-extrabold text-lg shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-3 group"
                        >
                            Start 1-minute Drill
                            <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                )}

                {gameState === "playing" && (
                    <div className="flex flex-col items-center w-full max-w-lg">

                        <div className="flex justify-between w-full px-8 mb-6 text-sm font-bold text-text-muted">
                            <span>Previous</span>
                            <span>Current</span>
                        </div>

                        <div className="flex items-center justify-center gap-8 mb-12 relative w-full">
                            {/* Previous Symbol (Small) */}
                            <div className="w-24 h-24 rounded-2xl bg-gray-50 flex items-center justify-center opacity-50 border border-gray-100">
                                <span className="text-5xl text-gray-400">{previousSymbol || "?"}</span>
                            </div>

                            <ArrowLeft className="w-8 h-8 text-gray-300 rotate-180" />

                            {/* Current Symbol (Large) */}
                            <div className={`w-40 h-40 rounded-[2rem] bg-white flex items-center justify-center shadow-2xl border-4 transition-colors duration-200 relative
                ${feedback === 'correct' ? 'border-accent-500 bg-accent-50' :
                                    feedback === 'wrong' ? 'border-red-500 bg-red-50' : 'border-primary-100'}`}
                            >
                                <span className="text-8xl text-foreground drop-shadow-md">{currentSymbol}</span>
                            </div>
                        </div>

                        {!previousSymbol ? (
                            <div className="w-full bg-primary-50 border border-primary-100 rounded-2xl p-6 text-center">
                                <p className="text-primary-700 font-bold mb-4">Memorize this first symbol, then click Start.</p>
                                <button
                                    onClick={handleStartSequence}
                                    className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors shadow-sm"
                                >
                                    Start Sequence
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-4 w-full px-4">
                                <button
                                    onClick={() => handleChoice(false)}
                                    className="flex-1 py-6 rounded-2xl bg-white border-2 border-red-100 hover:border-red-500 hover:bg-red-50 text-red-600 font-black text-xl transition-all shadow-sm flex flex-col items-center justify-center gap-2 group"
                                >
                                    <X className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                    NO MATCH
                                </button>
                                <button
                                    onClick={() => handleChoice(true)}
                                    className="flex-1 py-6 rounded-2xl bg-white border-2 border-accent-100 hover:border-accent-500 hover:bg-accent-50 text-accent-600 font-black text-xl transition-all shadow-sm flex flex-col items-center justify-center gap-2 group"
                                >
                                    <Check className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                    MATCH
                                </button>
                            </div>
                        )}

                        <p className="text-text-muted mt-8 font-medium">Use mouse to select</p>
                    </div>
                )}

                {gameState === "result" && (
                    <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-lg text-center max-w-md w-full relative">
                        <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trophy className="w-12 h-12 text-primary-500" />
                        </div>

                        <h2 className="text-3xl font-extrabold mb-2 text-foreground">Time's Up!</h2>
                        <p className="text-text-muted mb-8 font-medium">You survived {60 - timeLeft} seconds</p>

                        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                            <p className="text-sm text-text-muted uppercase tracking-widest font-extrabold mb-2">Final Score</p>
                            <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600">
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
                                className="flex-[2] py-4 px-4 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-bold transition-colors shadow-md flex items-center justify-center gap-2"
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