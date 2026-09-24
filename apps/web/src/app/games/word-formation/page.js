"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, SpellCheck2, Sparkles, AlertCircle, X } from "lucide-react";
import checkWord from "check-if-word";
import { REACTIONS } from "./reactionsData";
import { find } from "node-emoji";

const LEVELS = {
    EASY: { name: 'Easy', minLength: 3, multiplier: 1 },
    MEDIUM: { name: 'Medium', minLength: 4, multiplier: 1.5 },
    HARD: { name: 'Hard', minLength: 5, multiplier: 2 },
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

// HD Glowing Colors
const TILE_STYLES = [
    "bg-gradient-to-br from-red-400 to-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.5)] border-rose-400",
    "bg-gradient-to-br from-orange-400 to-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.5)] border-amber-400",
    "bg-gradient-to-br from-green-400 to-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.5)] border-emerald-400",
    "bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.5)] border-blue-400",
    "bg-gradient-to-br from-violet-400 to-purple-600 shadow-[0_0_15px_rgba(139,92,246,0.5)] border-purple-400",
    "bg-gradient-to-br from-fuchsia-400 to-pink-600 shadow-[0_0_15px_rgba(236,72,153,0.5)] border-pink-400"
];

const getRandomStyle = () => TILE_STYLES[Math.floor(Math.random() * TILE_STYLES.length)];

const getNotoEmojiUrl = (emoji) => {
    // Convert the emoji characters to their hex codepoints for the Google Noto URL (supporting ZWJ sequences)
    const codePoints = Array.from(emoji).map(char => char.codePointAt(0).toString(16).toLowerCase());
    // Google Noto Emoji URLs often omit the FE0F variation selector
    const filtered = codePoints.filter(cp => cp !== 'fe0f');
    const codePointStr = filtered.join('_');
    return `https://fonts.gstatic.com/s/e/notoemoji/latest/${codePointStr}/512.webp`;
};

export default function WordFormationGame() {
    const [leftTiles, setLeftTiles] = useState([]);
    const [centerTiles, setCenterTiles] = useState([]);
    const [score, setScore] = useState(0);
    const [dictionary, setDictionary] = useState(null);
    const [message, setMessage] = useState({ text: "", type: "" }); // type: 'success' | 'error'
    const [level, setLevel] = useState(LEVELS.EASY);
    const [reactionData, setReactionData] = useState(null);
    const [showReactionModal, setShowReactionModal] = useState(false);

    useEffect(() => {
        const words = checkWord('en');
        setDictionary(words);
    }, []);

    const initGame = useCallback(() => {
        let newTiles = ALPHABET.map((letter) => ({
            id: letter,
            letter: letter,
            style: getRandomStyle()
        }));
        setLeftTiles(newTiles);
        setCenterTiles([]);
        setScore(0);
        setMessage({ text: "", type: "" });
    }, []);

    useEffect(() => {
        if (dictionary) {
            initGame();
        }
    }, [dictionary, initGame]);

    const handleSelectLetter = (tile) => {
        // Clone the tile for the center area
        const newTile = { ...tile, uniqueId: Math.random().toString(36).substr(2, 9) };
        setCenterTiles([...centerTiles, newTile]);
        setMessage({ text: "", type: "" });
    };

    const handleRemoveFromCenter = (uniqueId) => {
        setCenterTiles(centerTiles.filter(t => t.uniqueId !== uniqueId));
    };

    const handleSubmit = () => {
        if (centerTiles.length === 0) return;
        
        const word = centerTiles.map(t => t.letter).join('');
        
        if (word.length < level.minLength) {
            setMessage({ text: `Word must be at least ${level.minLength} letters for ${level.name} mode`, type: 'error' });
            return;
        }

        const wordLower = word.trim().toLowerCase();
        
        let isValid = false;
        const words = word.trim().split(/\s+/);
        
        // 1. Check if every space-separated word is valid in dictionary
        if (words.length > 0 && words.every(w => dictionary.check(w.toLowerCase()))) {
            isValid = true;
        } 
        // 2. Check if the whole string without spaces is a valid word (e.g., "cauli flower" -> "cauliflower")
        else if (wordLower.replace(/\s+/g, '').length > 0 && dictionary.check(wordLower.replace(/\s+/g, ''))) {
            isValid = true;
        } 
        // 3. Check if it's explicitly in our custom REACTIONS list (e.g., "brinjal")
        else if (REACTIONS[wordLower] || REACTIONS[wordLower.replace(/\s+/g, '')]) {
            isValid = true;
        }

        if (isValid) {
            const points = Math.floor(word.replace(/\s/g, '').length * 10 * level.multiplier);
            setScore(s => s + points);
            setMessage({ text: `Awesome! +${points} pts`, type: 'success' });
            setCenterTiles([]);
            
            // Show Reaction Modal
            const wordLower = word.trim().toLowerCase();
            let reaction = REACTIONS[wordLower] || REACTIONS[wordLower.replace(/\s+/g, '')];

            if (!reaction) {
                // Dynamic Fallback: Check if node-emoji has an emoji for this word
                const foundEmoji = find(wordLower.replace(/\s+/g, '_'));
                if (foundEmoji && foundEmoji.emoji) {
                    reaction = {
                        emoji: foundEmoji.emoji,
                        soundText: `Awesome, ${wordLower}!`,
                        animation: 'animate-bounce'
                    };
                } else {
                    reaction = { 
                        emoji: '🌟', 
                        soundText: `Awesome, ${wordLower}!`, 
                        animation: 'animate-pulse' 
                    };
                }
            }
            
            setReactionData({ ...reaction, word: wordLower });
            setShowReactionModal(true);
            
            // Play Sound
            if ('speechSynthesis' in window) {
                // Cancel any ongoing speech
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(reaction.soundText);
                utterance.rate = 1.1;
                utterance.pitch = reaction.emoji === '🌟' ? 1.0 : 1.4; // Slightly higher pitch for animal sounds
                window.speechSynthesis.speak(utterance);
            }

            setTimeout(() => {
                setShowReactionModal(false);
            }, 2500); // Disappear after 2.5 seconds

        } else {
            setScore(s => Math.max(0, s - 5)); // Deduct score
            setMessage({ text: "no such words", type: 'error' });
            setCenterTiles([]);
        }
    };

    if (leftTiles.length === 0) return null;

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-8 font-sans flex flex-col items-center">
            <div className="w-full max-w-5xl mb-6 flex items-center justify-between">
                <Link href="/games" className="inline-flex items-center text-slate-500 hover:text-cyan-600 font-medium transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Games
                </Link>
                <div className="flex gap-3 items-center">
                    <SpellCheck2 className="w-8 h-8 text-cyan-500" />
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Word Formation</h1>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl">
                {/* Left Side: Alphabets */}
                <div className="flex-1 bg-slate-100 p-6 rounded-[2rem] shadow-inner border-2 border-slate-200">
                    <h2 className="text-xl font-bold text-slate-500 mb-6 text-center uppercase tracking-wider">Alphabets</h2>
                    <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
                        {leftTiles.map((tile) => (
                            <button
                                key={tile.id}
                                onClick={() => handleSelectLetter(tile)}
                                className={`
                                    relative aspect-square rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black text-white 
                                    cursor-pointer border-t border-l border-white/30
                                    transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-95
                                    ${tile.style}
                                `}
                            >
                                {tile.letter}
                            </button>
                        ))}
                    </div>
                    
                    {/* Space Button */}
                    <button
                        onClick={() => handleSelectLetter({ id: `space-${Date.now()}`, letter: ' ', style: 'bg-transparent border-dashed border-2 border-slate-300 w-8 sm:w-12 text-transparent shadow-none' })}
                        className="mt-3 w-full h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-slate-500 bg-slate-200 border-b-4 border-slate-300 active:border-b-0 active:translate-y-1 transition-all hover:bg-slate-300 hover:text-slate-600"
                    >
                        SPACE
                    </button>

                    <div className="mt-6 text-center text-sm font-bold text-slate-500">
                        Click letters to add them to the center area.
                    </div>
                </div>

                {/* Center / Right Side: Word Formation */}
                <div className="flex-1 flex flex-col items-center justify-start lg:pt-4">
                    <div className="flex justify-between w-full mb-8 items-end px-2">
                        <div>
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Score</span>
                            <div className="text-5xl font-black text-cyan-600 leading-none">{score}</div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-3">
                            <div className="flex items-center gap-2 bg-slate-200/50 p-1.5 rounded-xl border border-slate-200">
                                {Object.values(LEVELS).map((lvl) => (
                                    <button
                                        key={lvl.name}
                                        onClick={() => setLevel(lvl)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${level.name === lvl.name ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        {lvl.name}
                                    </button>
                                ))}
                            </div>
                            <button onClick={initGame} className="flex items-center gap-2 text-slate-500 hover:text-cyan-600 font-bold transition-colors">
                                <RefreshCw className="w-5 h-5" /> Reset Game
                            </button>
                        </div>
                    </div>

                    {/* Message Area */}
                    <div className="h-14 mb-4 w-full flex justify-center items-center">
                        {message.text && (
                            <div className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-lg animate-in slide-in-from-bottom-2 fade-in shadow-sm ${message.type === 'success' ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 'bg-rose-100 text-rose-600 border border-rose-200'}`}>
                                {message.type === 'success' ? <Sparkles className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                {message.text}
                            </div>
                        )}
                    </div>

                    {/* Formed Word Area */}
                    <div className="w-full bg-slate-100 min-h-[180px] p-6 rounded-[2rem] shadow-inner border-2 border-slate-200 flex flex-wrap gap-3 items-center justify-center mb-8 relative">
                        {centerTiles.length === 0 ? (
                            <span className="text-slate-400 font-medium text-lg absolute">Center place empty...</span>
                        ) : (
                            centerTiles.map((tile) => (
                                <button
                                    key={tile.uniqueId}
                                    onClick={() => handleRemoveFromCenter(tile.uniqueId)}
                                    className={`
                                        relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-black text-white 
                                        cursor-pointer border-t border-l border-white/30 hover:scale-105 transition-all
                                        animate-in zoom-in duration-200 hover:opacity-80
                                        ${tile.style}
                                    `}
                                    title="Click to remove"
                                >
                                    {tile.letter}
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center border-2 border-white shadow-md hover:bg-rose-500 transition-colors">
                                        <X className="w-3 h-3 text-white" />
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Submit Button */}
                    <button 
                        onClick={handleSubmit}
                        disabled={centerTiles.length === 0}
                        className="w-full sm:w-2/3 px-8 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-500 text-white font-black text-xl rounded-2xl shadow-[0_10px_20px_rgba(6,182,212,0.3)] hover:shadow-[0_15px_30px_rgba(6,182,212,0.4)] disabled:shadow-none hover:-translate-y-1 transition-all active:translate-y-0"
                    >
                        Submit Word
                    </button>
                </div>
            </div>

            {/* Reaction Emoji Modal */}
            {showReactionModal && reactionData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200 flex flex-col items-center max-w-sm w-full mx-4 relative overflow-hidden border border-white/20">
                        
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-blue-100/50 pointer-events-none"></div>

                        {/* High Definition Animated Emoji or Custom Image */}
                        <div className={`relative mb-8 mt-4 ${reactionData.animation}`}>
                            {reactionData.src ? (
                                <img 
                                    src={reactionData.src} 
                                    alt={reactionData.word}
                                    className="w-48 h-48 object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)] transition-all"
                                />
                            ) : (
                                <>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img 
                                        src={getNotoEmojiUrl(reactionData.emoji)} 
                                        alt={reactionData.emoji}
                                        className="w-48 h-48 object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)] transition-all"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                        }}
                                    />
                                    {/* Fallback Native Emoji */}
                                    <div className="hidden text-[150px] leading-none noto-emoji drop-shadow-xl">
                                        {reactionData.emoji}
                                    </div>
                                </>
                            )}
                        </div>
                        
                        <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 mb-2 uppercase tracking-widest z-10 drop-shadow-sm">{reactionData.word}</h3>
                        <p className="text-slate-500 font-bold text-xl text-center animate-pulse z-10">{reactionData.soundText}</p>
                    </div>
                </div>
            )}
        
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