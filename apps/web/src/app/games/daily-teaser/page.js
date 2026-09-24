"use client";

import { Lightbulb, Flame, ArrowLeft, Heart, RotateCcw, Trophy, XCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const sessionSeenSequences = new Set();

function generateRandomPuzzle() {
    let puzzle;
    let attempts = 0;
    
    do {
        const types = ['arithmetic', 'geometric', 'increasing_diff', 'squares'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        let seq = [];
        let answer = 0;
        let rule = "";
        
        if (type === 'arithmetic') {
            const start = Math.floor(Math.random() * 50) + 1; // Increased range
            const diff = Math.floor(Math.random() * 25) + 2; // Increased range
            seq = [start, start + diff, start + diff*2, start + diff*3];
            answer = start + diff*4;
            rule = `Add ${diff} each time`;
        } else if (type === 'geometric') {
            const start = Math.floor(Math.random() * 10) + 2; // Increased range
            const mult = Math.floor(Math.random() * 4) + 2; // Can be 2, 3, 4, 5
            seq = [start, start * mult, start * Math.pow(mult, 2), start * Math.pow(mult, 3)];
            answer = start * Math.pow(mult, 4);
            rule = `Multiply by ${mult}`;
        } else if (type === 'increasing_diff') {
            const start = Math.floor(Math.random() * 20) + 1; // Increased range
            const diffStart = Math.floor(Math.random() * 10) + 2; // Increased range
            const diffStep = Math.floor(Math.random() * 5) + 1; // Increased range
            
            let current = start;
            let d = diffStart;
            for(let i=0; i<4; i++) {
                seq.push(current);
                current += d;
                d += diffStep;
            }
            answer = current;
            rule = `Add ${diffStart}, ${diffStart+diffStep}, ${diffStart+diffStep*2}...`;
        } else if (type === 'squares') {
            const offset = Math.floor(Math.random() * 15) + 1; // Increased range
            for(let i=0; i<4; i++) {
                seq.push(Math.pow(offset + i, 2));
            }
            answer = Math.pow(offset + 4, 2);
            rule = `Perfect squares starting from ${offset}^2`;
        }

        // Generate options
        const options = [answer];
        while(options.length < 3) {
            // add random noise around answer (ensure we don't go negative if answer is positive)
            let noise = answer + (Math.floor(Math.random() * 25) - 12);
            if (noise !== answer && !options.includes(noise) && noise >= 0) {
                options.push(noise);
            }
        }
        // Shuffle options
        options.sort(() => Math.random() - 0.5);

        puzzle = {
            sequence: seq.join(", ") + ", ?",
            options,
            answer,
            rule
        };
        attempts++;
        
    } while (sessionSeenSequences.has(puzzle.sequence) && attempts < 100);

    sessionSeenSequences.add(puzzle.sequence);
    return puzzle;
}

export default function DailyTeaserGame() {
    const [puzzles, setPuzzles] = useState([]);
    const [currentLevel, setCurrentLevel] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing'); // playing, finished
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);

    useEffect(() => {
        setPuzzles(Array.from({length: 10}, generateRandomPuzzle));
    }, []);

    const handleOptionClick = (option) => {
        if (gameState !== 'playing' || selectedOption !== null || puzzles.length === 0) return;
        
        setSelectedOption(option);
        const correct = option === puzzles[currentLevel].answer;
        setIsCorrect(correct);

        if (correct) {
            setScore(s => s + 50);
            setTimeout(() => {
                if (currentLevel + 1 < puzzles.length) {
                    setCurrentLevel(l => l + 1);
                    setSelectedOption(null);
                    setIsCorrect(null);
                } else {
                    setGameState('finished');
                }
            }, 1500);
        } else {
            setScore(s => s - 20); // Deduct marks
            setTimeout(() => {
                if (currentLevel + 1 < puzzles.length) {
                    setCurrentLevel(l => l + 1);
                    setSelectedOption(null);
                    setIsCorrect(null);
                } else {
                    setGameState('finished');
                }
            }, 2500);
        }
    };

    const resetGame = () => {
        setPuzzles(Array.from({length: 10}, generateRandomPuzzle));
        setCurrentLevel(0);
        setScore(0);
        setGameState('playing');
        setSelectedOption(null);
        setIsCorrect(null);
    };

    if (puzzles.length === 0) return null; // Avoid rendering until puzzles are generated

    return (
        <div className="min-h-screen bg-surface p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/games" className="inline-flex items-center gap-2 text-text-muted hover:text-primary-600 transition-colors mb-8 font-bold">
                    <ArrowLeft className="w-5 h-5" /> Back to Games
                </Link>
                
                {/* Daily Brain Teaser */}
                <section className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-black mb-8 flex items-center justify-center gap-3 text-foreground">
                        <Lightbulb className="w-8 h-8 text-yellow-500" />
                        Daily Brain Teaser
                    </h2>

                    {gameState === 'playing' && (
                        <div className="flex items-center justify-between mb-6">
                            <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 font-bold text-gray-700">
                                Level {currentLevel + 1} / {puzzles.length}
                            </div>
                            <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 font-bold text-gray-700 flex items-center gap-2">
                                Score: <span className="text-primary-600">{score}</span>
                            </div>

                        </div>
                    )}

                    <div className="bg-white rounded-[2rem] p-6 md:p-10 border border-gray-200 shadow-xl hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] transition-all duration-500">
                        
                        {gameState === 'playing' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-yellow-700 bg-yellow-100 px-4 py-2 rounded-full uppercase tracking-wider border border-yellow-200">Logic Puzzle</span>
                                    <span className="flex items-center gap-1 text-sm font-bold text-gray-500 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                                        <Flame className="w-5 h-5 text-orange-500" /> +50 XP
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-extrabold text-gray-900 mb-4 leading-snug text-center">What comes next in the sequence?</h3>
                                    <div className="bg-slate-50 border border-slate-100 rounded-2xl py-12 my-8 relative overflow-hidden shadow-inner">
                                        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #94a3b8 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                                        <p className="relative z-10 text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-orange-500 tracking-[0.2em] text-center drop-shadow-sm">
                                            {puzzles[currentLevel].sequence}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    {puzzles[currentLevel].options.map((num) => (
                                        <button 
                                            key={num}
                                            onClick={() => handleOptionClick(num)}
                                            disabled={selectedOption !== null}
                                            className={`py-6 rounded-2xl border-2 font-bold transition-all shadow-sm text-xl
                                                ${selectedOption === num 
                                                    ? (isCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-emerald-500/20' : 'border-red-500 bg-red-50 text-red-700 shadow-red-500/20') 
                                                    : 'border-gray-200 text-gray-600 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 hover:shadow-md hover:-translate-y-1'}
                                                ${selectedOption !== null && selectedOption !== num && 'opacity-50'}
                                            `}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>

                                {selectedOption !== null && (
                                    <div className={`p-4 rounded-xl text-center font-bold text-lg animate-in fade-in slide-in-from-bottom-4 border ${isCorrect ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                                        {isCorrect ? "Correct! +50 XP" : `Incorrect! The correct answer was ${puzzles[currentLevel].answer}. -20 XP`}
                                        <p className="text-sm mt-1 opacity-80">{puzzles[currentLevel].rule}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {gameState === 'finished' && (
                            <div className="text-center py-12 space-y-6 animate-in zoom-in duration-500">
                                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                    <Trophy className="w-12 h-12 text-yellow-500" />
                                </div>
                                <h3 className="text-4xl font-black text-gray-900">Game Complete!</h3>
                                <p className="text-xl text-gray-600 font-medium max-w-md mx-auto">
                                    You completed all 10 puzzles! Your final score is <strong className="text-primary-600">{score} XP</strong>.
                                </p>
                                <button onClick={resetGame} className="mt-8 px-8 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 mx-auto">
                                    <RotateCcw className="w-5 h-5" /> Play Again
                                </button>
                            </div>
                        )}

                    </div>
                </section>
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