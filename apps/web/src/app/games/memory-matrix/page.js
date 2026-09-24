"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Trophy, Heart, Brain, Activity, LayoutGrid } from "lucide-react";

export default function MemoryMatrix() {
    const [gameState, setGameState] = useState("start"); // start, playing, result
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [gridSize, setGridSize] = useState(3); // 3x3 initially

    const [pattern, setPattern] = useState([]);
    const [clickedPattern, setClickedPattern] = useState([]);
    const [showPattern, setShowPattern] = useState(false);
    const [message, setMessage] = useState("Remember the pattern!");

    const generatePattern = useCallback(() => {
        // Increase grid size periodically (e.g., every 5 levels)
        const newGridSize = Math.min(3 + Math.floor(level / 5), 6);
        setGridSize(newGridSize);

        const patternLength = Math.min(3 + level, Math.floor((newGridSize * newGridSize) / 1.5));
        const newPattern = [];

        while (newPattern.length < patternLength) {
            const idx = Math.floor(Math.random() * (newGridSize * newGridSize));
            if (!newPattern.includes(idx)) {
                newPattern.push(idx);
            }
        }

        setPattern(newPattern);
        setClickedPattern([]);

        // Show pattern phase
        setShowPattern(true);
        setMessage("Remember the tiles!");

        // Hide pattern after timeout based on level
        const showDuration = Math.max(1000, 3000 - (level * 100)); // Gets faster

        setTimeout(() => {
            setShowPattern(false);
            setMessage("Now reconstruct it!");
        }, showDuration);

    }, [level]);

    useEffect(() => {
        if (gameState === "playing" && pattern.length === 0) {
            generatePattern();
        }
    }, [gameState, generatePattern, pattern.length]);

    const handleTileClick = (idx) => {
        if (gameState !== "playing" || showPattern || clickedPattern.includes(idx)) return;

        if (pattern.includes(idx)) {
            // Correct click
            const newClicked = [...clickedPattern, idx];
            setClickedPattern(newClicked);

            if (newClicked.length === pattern.length) {
                // Level complete
                setMessage("Perfect! Next level...");
                setScore(prev => prev + (level * 100));

                setTimeout(() => {
                    setLevel(prev => prev + 1);
                    setPattern([]); // Trigger regenerate
                }, 1000);
            }
        } else {
            // Incorrect click
            const newLives = lives - 1;
            setLives(newLives);
            setClickedPattern(prev => [...prev, idx]); // Mark wrong temporarily 

            if (newLives <= 0) {
                setGameState("result");
                setMessage("Game Over!");
                // We could submit the score to the DB here via Server Action
            } else {
                setMessage("Oops! Try again.");
                setTimeout(() => {
                    setPattern([]); // Restart level
                }, 1000);
            }
        }
    };

    const startGame = () => {
        setGameState("playing");
        setLevel(1);
        setScore(0);
        setLives(3);
        setPattern([]);
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
                            <Brain className="w-5 h-5 text-primary-500" />
                            <span className="font-extrabold text-foreground tracking-widest text-lg">Lvl {level}</span>
                        </div>
                        <div className="w-px h-6 bg-gray-200" />
                        <div className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-accent-500" />
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
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                        <div className="w-20 h-20 bg-primary-100/50 rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
                            <div className="absolute inset-0 border-2 border-primary-200 rounded-2xl animate-ping opacity-40" />
                            <LayoutGrid className="w-10 h-10 text-primary-600" />
                        </div>

                        <h1 className="text-3xl font-extrabold mb-4 text-foreground">Memory Matrix</h1>
                        <p className="text-text-muted mb-8 leading-relaxed font-medium">
                            A pattern of tiles will appear on the grid. Memorize their locations before they disappear, then click the correct tiles to rebuild the matrix.
                        </p>

                        <button
                            onClick={startGame}
                            className="w-full py-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-extrabold text-lg shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-3 group"
                        >
                            Start Training
                            <Activity className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                )}

                {gameState === "playing" && (
                    <div className="flex flex-col items-center">
                        <h2 className={`text-3xl font-extrabold mb-8 transition-colors ${message.includes("Oops") ? "text-red-500" : "text-foreground"}`}>
                            {message}
                        </h2>

                        <div
                            className="grid gap-2 sm:gap-4 p-5 rounded-[2rem] bg-white border border-gray-100 shadow-xl relative"
                            style={{
                                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                                maxWidth: '600px',
                                width: '100%',
                                aspectRatio: '1 / 1'
                            }}
                        >
                            {[...Array(gridSize * gridSize)].map((_, idx) => {
                                const isPattern = pattern.includes(idx);
                                const isClicked = clickedPattern.includes(idx);
                                const isWrong = isClicked && !isPattern;
                                const isCorrect = isClicked && isPattern;

                                let tileClass = "bg-gray-100 hover:bg-gray-200 border-transparent cursor-pointer";

                                if (showPattern) {
                                    if (isPattern) {
                                        tileClass = "bg-primary-500 shadow-md border-primary-600 scale-105 z-10";
                                    } else {
                                        tileClass = "bg-gray-50 border-transparent opacity-50";
                                    }
                                } else {
                                    if (isWrong) {
                                        tileClass = "bg-red-500 shadow-md border-transparent animate-pulse";
                                    } else if (isCorrect) {
                                        tileClass = "bg-primary-500 shadow-md border-transparent scale-105";
                                    }
                                }

                                return (
                                    <div
                                        key={idx}
                                        onClick={() => handleTileClick(idx)}
                                        className={`
                      rounded-2xl border-2 transition-all duration-300 transform 
                      ${tileClass}
                    `}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}

                {gameState === "result" && (
                    <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-lg text-center max-w-md w-full relative">
                        <div className="w-24 h-24 bg-accent-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trophy className="w-12 h-12 text-accent-500" />
                        </div>

                        <h2 className="text-3xl font-extrabold mb-2 text-foreground">Training Complete</h2>
                        <p className="text-text-muted mb-8 font-medium">You reached Level {level}</p>

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