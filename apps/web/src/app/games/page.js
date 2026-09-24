"use client";

import { useState, useEffect } from "react";
import { getApiBaseValue } from "@/api/questions";
import Link from "next/link";
import { LayoutGrid, Zap, Palette, Brain, Lightbulb, Egg, Apple, Grid3x3, SpellCheck2, Crosshair, PenTool, Puzzle, Calculator, Sparkles, Search, Repeat, Globe, Target, Snowflake, Waves, Landmark } from "lucide-react";

export default function GamesDirectory() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeModule, setActiveModule] = useState("All Modules");
    const [modules, setModules] = useState([]);

    useEffect(() => {
        const apiBase = getApiBaseValue();
        fetch(`${apiBase}/api/public/projects`)
            .then(res => res.json())
            .then(data => {
                if (data && data.projects) {
                    const items = data.projects.map(p => ({
                        name: p.name,
                        slug: p.slug
                    }));
                    const chunkSize = 7;
                    const newModules = [];
                    for (let i = 0; i < items.length; i += chunkSize) {
                        newModules.push({
                            title: "Module " + (Math.floor(i / chunkSize) + 1),
                            items: items.slice(i, i + chunkSize)
                        });
                    }
                    setModules(newModules);
                }
            })
            .catch(console.error);
    }, []);

    const games = [
        {
            id: "country-shooter",
            name: "Country Shooter",
            description: "Test your geography knowledge by shooting the correct properties of different countries.",
            category: "Knowledge",
            icon: Crosshair,
            cardBg: "bg-gradient-to-br from-sky-400 to-blue-600",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "state-capital-shooter",
            name: "State Capital Shooter",
            description: "Aim your cannon and shoot the correct US state capitals in glossy bubbles to test your geography accuracy.",
            category: "Knowledge",
            icon: Target,
            cardBg: "bg-gradient-to-br from-red-500 to-amber-600",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "trivia-smash",
            name: "Trivia Smash",
            description: "Smash through 3D blocks while answering engaging trivia questions in a ping-pong style game.",
            category: "Knowledge",
            icon: Target,
            cardBg: "bg-gradient-to-br from-pink-600 to-purple-800",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "institute-orbit",
            name: "Institute Orbit",
            description: "Launch into orbit and navigate through educational institutes in this space-themed challenge.",
            category: "Knowledge",
            icon: Target,
            cardBg: "bg-gradient-to-br from-indigo-500 to-purple-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "mystery-pointer",
            name: "Mystery Pointer(Vocab)",
            description: "Move your flashlight to discover hidden answers in the dark room quiz.",
            category: "Logic",
            icon: Search,
            cardBg: "bg-gradient-to-br from-gray-700 to-gray-900",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "cactiquiz",
            name: "Cactiquiz",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-cyan-500 to-cyan-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "city-runner",
            name: "City Runner",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-indigo-500 to-indigo-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "platformer",
            name: "Platformer",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-blue-500 to-blue-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "tactical-sniper",
            name: "Tactical Sniper",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-purple-500 to-purple-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "tanker",
            name: "Tanker",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-emerald-500 to-emerald-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "vocabullseye",
            name: "Vocabullseye",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-amber-500 to-amber-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "bubble-pop-safari",
            name: "Bubble Pop Safari",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-blue-500 to-blue-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "country-symbol-matcher",
            name: "Country Symbol Matcher",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-purple-500 to-purple-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "find-room",
            name: "Find Room",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-emerald-500 to-emerald-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "global-genius",
            name: "Global Genius",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-amber-500 to-amber-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "loop-game",
            name: "Loop Game",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-rose-500 to-rose-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "math-puzzle",
            name: "Math Puzzle",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-cyan-500 to-cyan-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "parliament-master",
            name: "Parliament Master",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-indigo-500 to-indigo-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "river-country-game",
            name: "River Country Game",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-blue-500 to-blue-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "seven-wonders",
            name: "Seven Wonders",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-purple-500 to-purple-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "train-game",
            name: "Train Game",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-emerald-500 to-emerald-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "wonder-assembly-hall",
            name: "Wonder Assembly Hall",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-amber-500 to-amber-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "wonder-bath-room",
            name: "Wonder Bathroom",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-rose-500 to-rose-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "wonder-bed-room",
            name: "Wonder Bed Room",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-cyan-500 to-cyan-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "wonder-canteen",
            name: "Wonder Canteen",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-indigo-500 to-indigo-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "wonder-classroom",
            name: "Wonder Classroom",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-blue-500 to-blue-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "wonder-computer-lab",
            name: "Wonder Computer Lab",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-purple-500 to-purple-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "wonder-garden",
            name: "Wonder Garden",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-emerald-500 to-emerald-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "wonder-kitchen",
            name: "Wonder Kitchen",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-amber-500 to-amber-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "wonder-lab-chem",
            name: "Wonder Lab Chem",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-rose-500 to-rose-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "wonder-lawn",
            name: "Wonder Lawn",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-cyan-500 to-cyan-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "wonder-library",
            name: "Wonder Library",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-indigo-500 to-indigo-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "wonder-play-ground",
            name: "Wonder Play Ground",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-blue-500 to-blue-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "wonder-principal-room",
            name: "Wonder Principal Room",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-purple-500 to-purple-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "wonder-school-bus",
            name: "Wonder School Bus",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-emerald-500 to-emerald-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "wonder-school-toilet",
            name: "Wonder School Restroom",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-amber-500 to-amber-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "wonder-sick-room",
            name: "Wonder Infirmary",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-rose-500 to-rose-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "wonder-staff-room",
            name: "Wonder Staff Room",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-cyan-500 to-cyan-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "wonder1-assembly-hall",
            name: "Wonder1 Assembly Hall",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-indigo-500 to-indigo-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "wonder1-play-ground",
            name: "Wonder1 Play Ground",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-blue-500 to-blue-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "wonder1-principal-room",
            name: "Wonder1 Principal Room",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-purple-500 to-purple-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "wonder1-school-bus",
            name: "Wonder1 School Bus",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-emerald-500 to-emerald-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "word-canve",
            name: "Word Cave",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-amber-500 to-amber-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "word-puzzle",
            name: "Word Puzzle",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-rose-500 to-rose-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "color-clash",
            name: "Color Clash",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-cyan-500 to-cyan-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "daily-teaser",
            name: "Daily Brain Teaser",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-indigo-500 to-indigo-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "egg-catcher",
            name: "Egg Toss",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-blue-500 to-blue-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "memory-matrix",
            name: "Memory Matrix",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-purple-500 to-purple-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "monkey-fruit-drop",
            name: "Monkey Fruit Drop",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-emerald-500 to-emerald-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "speed-match",
            name: "Speed Match",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-amber-500 to-amber-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "sudoku",
            name: "Sudoku",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-rose-500 to-rose-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "word-2-picture",
            name: "Word 2 Picture",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-cyan-500 to-cyan-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "word-formation",
            name: "Word Formation",
            description: "A fun and engaging game to test your cognitive skills.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-indigo-500 to-indigo-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "cricket",
            name: "Cricket World Cup Quiz",
            description: "Test your knowledge of the Cricket World Cup with this exciting quiz game.",
            category: "Knowledge",
            icon: Target,
            cardBg: "bg-gradient-to-br from-green-500 to-green-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "helicopter-trivia",
            name: "Helicopter Trivia",
            description: "Fly a tactical helicopter and answer trivia questions to eliminate targets.",
            category: "Knowledge",
            icon: Target,
            cardBg: "bg-gradient-to-br from-slate-700 to-slate-900",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
        {
            id: "vocabkicker",
            name: "Vocabkicker",
            description: "Score goals by choosing the correct vocabulary word in this football-themed game.",
            category: "Logic",
            icon: Target,
            cardBg: "bg-gradient-to-br from-emerald-500 to-teal-700",
            textColor: "text-white",
            pillBg: "bg-white/20",
            pillText: "text-white",
            disabled: false,
        },
    ];

    const categories = ["All", ...Array.from(new Set(games.map(g => g.category)))];

    const activeModuleData = modules.find(m => m.title === activeModule);
    const moduleSlugs = activeModuleData ? activeModuleData.items.map(item => item.slug) : [];

    const filteredGames = games.filter(g => {
        const matchesCategory = activeCategory === "All" || g.category === activeCategory;
        const matchesModule = activeModule === "All Modules" || moduleSlugs.includes(g.id);
        return matchesCategory && matchesModule;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2 flex items-center gap-3 text-foreground">
                        <Brain className="w-10 h-10 text-primary-500" />
                        Free Game Zone
                    </h1>
                    <p className="text-text-muted text-lg font-medium">Choose an exercise to target specific cognitive skills.</p>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-2 items-center">
                        <select
                            value={activeModule}
                            onChange={(e) => {
                                setActiveModule(e.target.value);
                                if (e.target.value !== "All Modules") setActiveCategory("All");
                            }}
                            className="px-4 py-2 rounded-full font-bold text-sm bg-white text-gray-700 border border-gray-200 outline-none cursor-pointer hover:border-primary-300 shadow-sm appearance-none pr-8"
                            style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7em top 50%', backgroundSize: '.65em auto' }}
                        >
                            <option value="All Modules">All Modules</option>
                            {modules.map(mod => (
                                <option key={mod.title} value={mod.title}>{mod.title}</option>
                            ))}
                        </select>
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${activeCategory === category
                                    ? "bg-primary-600 text-white shadow-md shadow-primary-200"
                                    : "bg-white text-text-muted border border-gray-200 hover:border-primary-300 hover:text-primary-600"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {filteredGames.map((game) => {
                    const Icon = game.icon;
                    return (
                        <div
                            key={game.id}
                            className={`
                relative rounded-3xl p-5 border border-white/20
                group overflow-hidden transition-all duration-300
                ${game.cardBg}
                ${game.disabled 
                  ? 'opacity-60 grayscale' 
                  : 'shadow-[0_10px_20px_rgba(0,0,0,0.3),_inset_0_-4px_0_rgba(0,0,0,0.2)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.4),_inset_0_-1px_0_rgba(0,0,0,0.1)] hover:-translate-y-2 hover:scale-[1.02] cursor-pointer'}
              `}
                        >
                            {/* Subtle overlay glow */}
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />

                            {game.disabled && (
                                <div className="absolute top-4 right-4 text-[9px] uppercase tracking-wider font-extrabold px-2 py-1 rounded-full bg-black/20 text-white backdrop-blur-md">
                                    Coming Soon
                                </div>
                            )}

                            <div className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-white/20 backdrop-blur-sm shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                                <Icon className={`w-6 h-6 text-white drop-shadow-sm`} />
                            </div>

                            <h3 className={`relative z-10 text-xl font-extrabold mb-1.5 ${game.textColor}`}>{game.name}</h3>
                            <p className={`relative z-10 text-xs mb-6 font-medium leading-snug opacity-90 line-clamp-3 ${game.textColor}`}>{game.description}</p>

                            <div className="relative z-10 flex items-center justify-between mt-auto">
                                <span className={`text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm ${game.pillBg} ${game.pillText}`}>
                                    {game.category}
                                </span>

                                {!game.disabled ? (
                                    <Link
                                        href={`/games/${game.id}`}
                                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white text-gray-900 group-hover:scale-110 group-hover:shadow-lg transition-all"
                                    >
                                        <span className="sr-only">Play</span>
                                        <span aria-hidden="true" className="font-bold text-lg leading-none mb-0.5">→</span>
                                    </Link>
                                ) : (
                                    <button disabled className="text-sm font-bold text-gray-400 cursor-not-allowed">
                                        Locked
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}

                {filteredGames.length === 0 && (
                    <div className="col-span-full py-12 text-center text-text-muted font-medium">
                        No games found in this category.
                    </div>
                )}
            </div>
        </div>
    );
}
