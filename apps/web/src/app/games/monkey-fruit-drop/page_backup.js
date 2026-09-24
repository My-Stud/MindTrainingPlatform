"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Play, RefreshCw, Trophy, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Game Constants
const GAME_WIDTH = 600;
const GAME_HEIGHT = 600;
const PLAYER_WIDTH = 80;
const MOMO_WIDTH = 100;
const BERRY_SIZE = 40;
const WIN_SCORE = 30;

const MonkeySVG = ({ expression = "normal" }) => (
  <svg width="120" height="130" viewBox="0 0 120 130" className="drop-shadow-xl">
    {/* Tail */}
    <path d="M 30,90 Q 0,100 10,120 Q 30,120 20,100" fill="none" stroke="#4A3022" strokeWidth="8" strokeLinecap="round"/>
    {/* Body */}
    <ellipse cx="60" cy="90" rx="35" ry="40" fill="#724A30"/>
    <ellipse cx="60" cy="95" rx="25" ry="30" fill="#E6C287"/>
    {/* Legs */}
    <rect x="35" y="110" width="14" height="20" rx="6" fill="#724A30"/>
    <rect x="71" y="110" width="14" height="20" rx="6" fill="#724A30"/>
    {/* Arms */}
    <path d={expression === "surprised" ? "M 35,80 Q 20,60 10,50" : "M 35,80 Q 20,90 20,110"} fill="none" stroke="#724A30" strokeWidth="14" strokeLinecap="round"/>
    <path d={expression === "surprised" ? "M 85,80 Q 100,60 110,50" : "M 85,80 Q 100,90 100,110"} fill="none" stroke="#724A30" strokeWidth="14" strokeLinecap="round"/>
    {/* Ears */}
    <circle cx="25" cy="45" r="15" fill="#E6C287"/>
    <circle cx="25" cy="45" r="8" fill="#724A30"/>
    <circle cx="95" cy="45" r="15" fill="#E6C287"/>
    <circle cx="95" cy="45" r="8" fill="#724A30"/>
    {/* Head */}
    <circle cx="60" cy="45" r="30" fill="#724A30"/>
    <path d="M 40,45 Q 60,70 80,45 A 20,20 0 0,0 40,45 Z" fill="#E6C287"/>
    <circle cx="60" cy="50" r="22" fill="#E6C287"/>
    
    {/* Eyes */}
    {expression === "laughing" ? (
      <>
        <path d="M 45,40 Q 50,35 55,40" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
        <path d="M 65,40 Q 70,35 75,40" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      </>
    ) : expression === "surprised" ? (
      <>
        <circle cx="50" cy="38" r="8" fill="#fff"/>
        <circle cx="70" cy="38" r="8" fill="#fff"/>
        <circle cx="50" cy="38" r="3" fill="#000"/>
        <circle cx="70" cy="38" r="3" fill="#000"/>
      </>
    ) : (
      <>
        <circle cx="50" cy="38" r="5" fill="#000"/>
        <circle cx="70" cy="38" r="5" fill="#000"/>
        <circle cx="48" cy="36" r="1.5" fill="#fff"/>
        <circle cx="68" cy="36" r="1.5" fill="#fff"/>
      </>
    )}

    {/* Nose */}
    <ellipse cx="60" cy="52" rx="5" ry="3.5" fill="#4A3022"/>
    
    {/* Mouth */}
    {expression === "laughing" ? (
      <path d="M 45,58 Q 60,75 75,58 Z" fill="#7F1D1D"/>
    ) : expression === "surprised" ? (
      <ellipse cx="60" cy="62" rx="6" ry="8" fill="#000"/>
    ) : (
      <path d="M 50,60 Q 60,68 70,60" fill="none" stroke="#4A3022" strokeWidth="2.5" strokeLinecap="round"/>
    )}
    
    {/* Rosy Cheeks */}
    <circle cx="40" cy="50" r="6" fill="#FCA5A5" fillOpacity="0.6"/>
    <circle cx="80" cy="50" r="6" fill="#FCA5A5" fillOpacity="0.6"/>
  </svg>
);

const ChildSVG = ({ isHit, direction = "right", headTilt = 0 }) => (
  <svg width="80" height="130" viewBox="0 0 80 130" className="drop-shadow-xl" style={{ transform: direction === "right" ? "scaleX(-1)" : "none", transition: "transform 0.15s ease-in-out" }}>
    {/* Legs */}
    <rect x="30" y="90" width="8" height="35" rx="3" fill="#1E40AF"/>
    <rect x="42" y="90" width="8" height="35" rx="3" fill="#1E40AF"/>
    <ellipse cx="34" cy="125" rx="8" ry="5" fill="#333"/>
    <ellipse cx="46" cy="125" rx="8" ry="5" fill="#333"/>
    
    {/* Body */}
    <rect x="25" y="55" width="30" height="40" rx="10" fill="#EF4444"/>
    
    {/* Back Arm */}
    <path d="M 40,65 Q 60,50 65,35" fill="none" stroke="#B91C1C" strokeWidth="10" strokeLinecap="round"/>
    <circle cx="65" cy="35" r="5" fill="#FCD34D"/>

    {/* Neck */}
    <rect x="36" y="45" width="8" height="15" fill="#FCD34D"/>

    {/* Dynamic Head Group */}
    <g style={{ transform: `rotate(${headTilt}deg)`, transformOrigin: "40px 45px", transition: "transform 0.1s ease-out" }}>
      {/* Back Hair */}
      <circle cx="45" cy="25" r="24" fill="#8B5A2B"/>
      
      {/* Head Base (Bigger, more attractive) */}
      <circle cx="32" cy="25" r="24" fill="#FCD34D"/>
      
      {/* Cute small nose */}
      <circle cx="8" cy="25" r="4.5" fill="#FBBF24"/>
      
      {/* Big Anime-style Eye */}
      {isHit ? (
        <path d="M 18,15 L 28,23 M 18,23 L 28,15" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      ) : (
        <>
          <ellipse cx="25" cy="18" rx="6" ry="8" fill="#fff"/>
          <ellipse cx="23" cy="18" rx="3.5" ry="5.5" fill="#000"/>
          <circle cx="21" cy="15" r="2" fill="#fff"/>
        </>
      )}
      
      {/* Big open mouth to catch fruit */}
      <ellipse cx="18" cy="38" rx="10" ry="12" fill="#7F1D1D" transform="rotate(-15 18 38)"/>
      {/* Tongue */}
      <ellipse cx="19" cy="46" rx="6" ry="4" fill="#EF4444" transform="rotate(-15 19 46)"/>

      {/* Front Hair */}
      <path d="M 10,12 Q 30,-8 50,8 Q 55,16 55,25 Q 45,8 28,10 Q 18,13 10,12 Z" fill="#8B5A2B"/>
      
      {/* Rosy cheek */}
      <ellipse cx="32" cy="28" rx="5" ry="3.5" fill="#F87171" opacity="0.6"/>
    </g>

    {/* Front Arm */}
    <path d="M 40,65 Q 20,50 15,35" fill="none" stroke="#EF4444" strokeWidth="10" strokeLinecap="round"/>
    <circle cx="15" cy="35" r="5" fill="#FCD34D"/>
  </svg>
);

const BackgroundChildSVG = ({ reaction = "idle", color = "#3B82F6", hairColor = "#F59E0B" }) => {
  // Define animation classes based on reaction
  let animClass = "";
  let transformStyle = {};
  
  if (reaction === "laughing_stand") {
    animClass = "animate-bounce";
  } else if (reaction === "laughing_roll") {
    // Rolling on the floor laughing
    transformStyle = { transform: "rotate(-80deg) translate(-20px, 30px)" };
    animClass = "animate-pulse"; 
  } else if (reaction === "laughing_point") {
    animClass = "animate-bounce";
    transformStyle = { transform: "rotate(10deg)" };
  }

  return (
    <div className={`transition-all duration-300 ${animClass}`} style={transformStyle}>
      <svg width="70" height="110" viewBox="0 0 70 110" className="drop-shadow-lg">
        {/* Legs */}
        <rect x="25" y="80" width="8" height="25" rx="3" fill="#1E3A8A"/>
        <rect x="37" y="80" width="8" height="25" rx="3" fill="#1E3A8A"/>
        <ellipse cx="29" cy="105" rx="8" ry="4" fill="#111"/>
        <ellipse cx="41" cy="105" rx="8" ry="4" fill="#111"/>
        
        {/* Body */}
        <rect x="20" y="45" width="30" height="40" rx="8" fill={color}/>
        
        {/* Arms */}
        {reaction === "cheering" ? (
          <>
            <path d="M 20,55 Q 5,40 10,25" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"/>
            <path d="M 50,55 Q 65,40 60,25" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"/>
          </>
        ) : reaction === "laughing_roll" ? (
          <>
            {/* Holding stomach */}
            <path d="M 20,55 Q 35,65 25,75" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"/>
            <path d="M 50,55 Q 35,65 45,75" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"/>
          </>
        ) : reaction === "laughing_point" ? (
          <>
            {/* Pointing and holding stomach */}
            <path d="M 20,55 Q 5,70 -5,60" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"/>
            <path d="M 50,55 Q 35,65 45,75" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"/>
          </>
        ) : reaction === "laughing_stand" ? (
          <>
            <path d="M 20,55 Q 5,70 25,75" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"/>
            <path d="M 50,55 Q 65,70 45,75" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"/>
          </>
        ) : (
          <>
            <path d="M 20,55 Q 10,70 15,85" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"/>
            <path d="M 50,55 Q 60,70 55,85" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"/>
          </>
        )}
        
        {/* Hands */}
        {reaction === "cheering" && (
          <>
            <circle cx="10" cy="25" r="4" fill="#FCD34D"/>
            <circle cx="60" cy="25" r="4" fill="#FCD34D"/>
          </>
        )}

        {/* Head */}
        <circle cx="35" cy="25" r="18" fill="#FCD34D"/>
        <path d="M 17,25 C 17,5 53,5 53,25 C 53,18 35,10 17,25" fill={hairColor}/>
        
        {/* Face */}
        {reaction.startsWith("laughing") ? (
          <>
            <path d="M 25,20 Q 30,15 35,20" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
            <path d="M 35,20 Q 40,15 45,20" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
            {/* Big funny mouth showing teeth */}
            <path d="M 22,28 Q 35,48 48,28 Z" fill="#7F1D1D"/>
            <path d="M 25,28 Q 35,32 45,28 Z" fill="#fff"/>
            <path d="M 28,35 Q 35,42 42,35 Z" fill="#EF4444"/>
          </>
        ) : reaction === "cheering" ? (
          <>
            <circle cx="28" cy="20" r="2.5" fill="#000"/>
            <circle cx="42" cy="20" r="2.5" fill="#000"/>
            <path d="M 28,30 Q 35,40 42,30 Z" fill="#7F1D1D"/>
          </>
        ) : (
          <>
            <circle cx="28" cy="22" r="2.5" fill="#000"/>
            <circle cx="42" cy="22" r="2.5" fill="#000"/>
            <path d="M 30,30 Q 35,35 40,30" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
          </>
        )}
      </svg>
    </div>
  );
};

const BlackberrySVG = () => (
  <svg width="28" height="28" viewBox="0 0 40 40" className="drop-shadow-md">
    <path d="M 20,10 Q 10,0 5,10 Q 20,15 20,10" fill="#22C55E"/>
    <path d="M 20,10 Q 30,0 35,10 Q 20,15 20,10" fill="#22C55E"/>
    <circle cx="15" cy="18" r="5" fill="#4C1D95"/>
    <circle cx="25" cy="18" r="5" fill="#4C1D95"/>
    <circle cx="20" cy="22" r="5" fill="#5B21B6"/>
    <circle cx="12" cy="25" r="5" fill="#4C1D95"/>
    <circle cx="28" cy="25" r="5" fill="#4C1D95"/>
    <circle cx="18" cy="30" r="5" fill="#5B21B6"/>
    <circle cx="24" cy="30" r="5" fill="#4C1D95"/>
    <circle cx="20" cy="35" r="5" fill="#3B0764"/>
  </svg>
);

const GuavaSVG = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" className="drop-shadow-md">
    <ellipse cx="20" cy="20" rx="16" ry="18" fill="#84CC16" />
    <ellipse cx="16" cy="18" rx="8" ry="10" fill="#A3E635" opacity="0.6" />
    {/* Stalk */}
    <path d="M 20,5 Q 18,0 22,-2" fill="none" stroke="#4D7C0F" strokeWidth="3" strokeLinecap="round" />
    {/* Bottom star */}
    <path d="M 18,37 L 20,38 L 22,37 L 21,35 L 19,35 Z" fill="#4D7C0F" />
    <circle cx="23" cy="15" r="1.5" fill="#4D7C0F" opacity="0.4" />
    <circle cx="15" cy="25" r="1" fill="#4D7C0F" opacity="0.4" />
    <circle cx="26" cy="26" r="1.5" fill="#4D7C0F" opacity="0.4" />
  </svg>
);

const CoconutSVG = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" className="drop-shadow-md">
    <circle cx="20" cy="20" r="18" fill="#5c4033" />
    <circle cx="20" cy="20" r="17" fill="#8b5a2b" />
    <circle cx="15" cy="12" r="3" fill="#3e2723" />
    <circle cx="25" cy="12" r="3" fill="#3e2723" />
    <circle cx="20" cy="18" r="3.5" fill="#3e2723" />
    <path d="M 5,20 Q 10,25 20,35" fill="none" stroke="#5c4033" strokeWidth="2" strokeLinecap="round"/>
    <path d="M 35,20 Q 30,25 20,35" fill="none" stroke="#5c4033" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CricketManSVG = ({ catchStyle = "idle", direction = "right" }) => {
  let armPath1 = "M 70,110 Q 30,80 20,50"; 
  let armPath2 = "M 70,110 Q 50,140 20,150"; 
  let hand1 = { x: 20, y: 50 };
  let hand2 = { x: 20, y: 150 };
  let bodyYOffset = 0;
  let transformStr = direction === "right" ? "scaleX(-1)" : "none";

  if (catchStyle === "high_catch") {
    armPath1 = "M 70,110 Q 50,40 40,10"; hand1 = { x: 40, y: 10 };
    armPath2 = "M 70,110 Q 70,40 60,10"; hand2 = { x: 60, y: 10 };
  } else if (catchStyle === "flat_catch") {
    armPath1 = "M 70,110 Q 30,100 10,90"; hand1 = { x: 10, y: 90 };
    armPath2 = "M 70,110 Q 30,120 10,110"; hand2 = { x: 10, y: 110 };
  } else if (catchStyle === "one_handed") {
    armPath1 = "M 70,110 Q 30,80 0,50"; hand1 = { x: 0, y: 50 };
    armPath2 = "M 70,110 Q 80,140 100,160"; hand2 = { x: 100, y: 160 };
  } else if (catchStyle === "diving") {
    transformStr += " rotate(-70deg)";
    bodyYOffset = -80; 
    armPath1 = "M 70,110 Q 30,50 0,10"; hand1 = { x: 0, y: 10 };
    armPath2 = "M 70,110 Q 50,50 20,30"; hand2 = { x: 20, y: 30 };
  }

  const renderHand = (x, y) => (
    <g transform={`translate(${x-18}, ${y-18}) scale(1.2)`}>
      <path fill="#f1c27d" d="M24,14h-1V8c0-1.657-1.343-3-3-3s-3,1.343-3,3v2h-1V4c0-1.657-1.343-3-3-3s-3,1.343-3,3v6h-1V2 c0-1.657-1.343-3-3-3s-3,1.343-3,3v13h-1C4.343,15,3,16.343,3,18v3c0,4.962,4.038,9,9,9h7c5.514,0,10-4.486,10-10v-3 C29,15.343,26.761,14,24,14z"/>
    </g>
  );

  return (
    <svg width="160" height="230" viewBox="0 0 160 230" className="drop-shadow-2xl transition-all duration-300" style={{ transform: transformStr, marginTop: bodyYOffset }}>
      {/* Legs */}
      <rect x="55" y="160" width="16" height="60" rx="5" fill="#1E40AF"/>
      <rect x="75" y="160" width="16" height="60" rx="5" fill="#1E40AF"/>
      {/* Shoes */}
      <ellipse cx="63" cy="225" rx="14" ry="8" fill="#333"/>
      <ellipse cx="83" cy="225" rx="14" ry="8" fill="#333"/>
      
      {/* Caught Coconut */}
      {catchStyle !== "idle" && (
         <g transform={`translate(${
           catchStyle === "high_catch" ? "20, -10" : 
           catchStyle === "flat_catch" ? "-15, 60" : 
           catchStyle === "one_handed" ? "-25, 20" : 
           "-25, -20" // diving
         }) scale(1)`}>
           <CoconutSVG />
         </g>
      )}

      {/* Back Arm */}
      <path d={armPath1} fill="none" stroke="#0284C7" strokeWidth="16" strokeLinecap="round" className="transition-all duration-200"/>
      {renderHand(hand1.x, hand1.y)}
      
      {/* Torso */}
      <rect x="45" y="90" width="60" height="80" rx="20" fill="#0EA5E9"/>
      <rect x="45" y="110" width="60" height="15" fill="#FDE047"/>
      
      {/* Neck */}
      <rect x="65" y="70" width="16" height="25" fill="#f1c27d"/>
      
      {/* Head */}
      <circle cx="73" cy="45" r="35" fill="#f1c27d"/>
      
      {/* Cap */}
      <path d="M 38,45 A 35,35 0 0 1 108,45 Z" fill="#1E3A8A"/>
      <path d="M 38,45 Q 10,45 10,35 Q 38,25 38,45 Z" fill="#1E3A8A"/>

      {/* Face */}
      <circle cx="55" cy="55" r="4" fill="#000"/>
      <circle cx="75" cy="55" r="4" fill="#000"/>
      <path d="M 55,70 Q 65,65 75,70" fill="none" stroke="#4A3022" strokeWidth="3" strokeLinecap="round"/>
      
      {/* Front Arm */}
      <path d={armPath2} fill="none" stroke="#0284C7" strokeWidth="16" strokeLinecap="round" className="transition-all duration-200"/>
      {renderHand(hand2.x, hand2.y)}
    </svg>
  );
};

const BasketChildBackSVG = ({ isHit, direction = "right", score = 0 }) => {
  const displayCount = Math.min(score, 20);
  // Deterministic positions based on index
  const guavas = Array.from({ length: displayCount }).map((_, i) => ({
    x: 10 + (i % 5) * 10 + ((i * 7) % 5),
    y: 85 - Math.floor(i / 5) * 8 + ((i * 13) % 4),
    rot: (i * 37) % 360
  }));

  return (
    <svg width="180" height="130" viewBox="0 0 180 130" className="drop-shadow-xl" style={{ transform: direction === "right" ? "scaleX(-1)" : "none", transition: "transform 0.15s ease-in-out" }}>
      {/* Back Arm (Left hand) reaching far side */}
      <path d="M 125,60 Q 85,30 10,50" fill="none" stroke="#CA8A04" strokeWidth="8" strokeLinecap="round"/>
      <circle cx="10" cy="50" r="4" fill="#D97706"/>

      {/* Legs */}
      <rect x="110" y="90" width="8" height="35" rx="3" fill="#78350F"/>
      <rect x="122" y="90" width="8" height="35" rx="3" fill="#78350F"/>
      <ellipse cx="114" cy="125" rx="8" ry="5" fill="#451A03"/>
      <ellipse cx="126" cy="125" rx="8" ry="5" fill="#451A03"/>
      
      {/* Body */}
      <rect x="105" y="55" width="30" height="40" rx="10" fill="#EAB308"/>
      
      {/* Head Group */}
      <g style={{ transformOrigin: "120px 45px" }}>
        <circle cx="125" cy="25" r="24" fill="#111827"/>
        <circle cx="112" cy="25" r="24" fill="#D97706"/>
        <circle cx="88" cy="25" r="4.5" fill="#B45309"/>
        
        {isHit ? (
          <path d="M 98,15 L 108,23 M 98,23 L 108,15" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
        ) : (
          <>
            <ellipse cx="105" cy="18" rx="6" ry="8" fill="#fff"/>
            <ellipse cx="103" cy="18" rx="3.5" ry="5.5" fill="#000"/>
            <circle cx="101" cy="15" r="2" fill="#fff"/>
          </>
        )}
        
        <path d="M 92,38 Q 100,42 108,38" fill="none" stroke="#7F1D1D" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M 90,12 Q 110,-8 130,8 Q 135,16 135,25 Q 125,8 108,10 Q 98,13 90,12 Z" fill="#111827"/>
        <ellipse cx="112" cy="28" rx="5" ry="3.5" fill="#B45309" opacity="0.6"/>
      </g>

      {/* Basket Back Rim (inside) */}
      <ellipse cx="35" cy="50" rx="35" ry="15" fill="#92400E"/>
      
      {/* Guavas in Basket */}
      {guavas.map((g, i) => (
         <g key={i} transform={`translate(${g.x - 20}, ${g.y - 20}) rotate(${g.rot} 20 20) scale(0.6)`}>
            <GuavaSVG />
         </g>
      ))}
    </svg>
  );
};

const BasketChildFrontSVG = ({ direction = "right" }) => {
  return (
    <svg width="180" height="130" viewBox="0 0 180 130" className="drop-shadow-xl" style={{ transform: direction === "right" ? "scaleX(-1)" : "none", transition: "transform 0.15s ease-in-out" }}>
      {/* Basket Front Bowl */}
      <path d="M 0,50 C 0,115 70,115 70,50 Z" fill="rgba(217, 119, 6, 0.45)" stroke="#B45309" strokeWidth="3"/>
      {/* Wicker Pattern Details */}
      <path d="M 5,65 Q 35,85 65,65 M 10,75 Q 35,100 60,75 M 20,85 Q 35,105 50,85" fill="none" stroke="#B45309" strokeWidth="2" opacity="0.4"/>
      <path d="M 15,50 Q 15,80 25,100 M 35,50 L 35,105 M 55,50 Q 55,80 45,100" fill="none" stroke="#B45309" strokeWidth="2" opacity="0.4"/>
      
      {/* Basket Front Rim */}
      <path d="M 0,50 A 35 15 0 0 0 70 50" fill="none" stroke="#F59E0B" strokeWidth="4"/>

      {/* Front Arm (Right hand) reaching near side */}
      <path d="M 115,65 Q 100,85 60,55" fill="none" stroke="#EAB308" strokeWidth="8" strokeLinecap="round"/>
      <circle cx="60" cy="55" r="4" fill="#D97706"/>
    </svg>
  );
};

export default function MonkeyFruitDrop() {
  const [gameState, setGameState] = useState("intro"); // "intro", "playing", "level_won", "game_won"
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  
  const [momoX, setMomoX] = useState(GAME_WIDTH / 2);
  const [playerX, setPlayerX] = useState(GAME_WIDTH / 2);
  const [playerDirection, setPlayerDirection] = useState("right");
  const [berries, setBerries] = useState([]); 
  const [sceneEvent, setSceneEvent] = useState(null);
  
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [finalTime, setFinalTime] = useState(0);
  
  const requestRef = useRef();
  const momoDirectionRef = useRef(1); 
  const lastDropTimeRef = useRef(0);
  const gameContainerRef = useRef(null);
  
  const stateRef = useRef({
    momoX: GAME_WIDTH / 2,
    playerX: GAME_WIDTH / 2,
    berries: [],
    score: 0,
    gameState: "intro",
    level: 1,
    startTime: 0
  });

  useEffect(() => {
    stateRef.current = { momoX, playerX, berries, score, gameState, level, startTime };
  }, [momoX, playerX, berries, score, gameState, level, startTime]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (stateRef.current.gameState !== "playing") return;
      
      if (e.key === "ArrowLeft") {
        setPlayerX((prev) => {
          setPlayerDirection("left");
          return Math.max(PLAYER_WIDTH / 2, prev - 30);
        });
      } else if (e.key === "ArrowRight") {
        setPlayerX((prev) => {
          setPlayerDirection("right");
          return Math.min(GAME_WIDTH - PLAYER_WIDTH / 2, prev + 30);
        });
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handlePointerMove = (clientX) => {
    if (gameState !== "playing" || !gameContainerRef.current) return;
    const rect = gameContainerRef.current.getBoundingClientRect();
    const scale = GAME_WIDTH / rect.width;
    const x = (clientX - rect.left) * scale;
    
    setPlayerX((prev) => {
      let newX = x;
      if (newX < PLAYER_WIDTH/2) newX = PLAYER_WIDTH/2;
      if (newX > GAME_WIDTH - PLAYER_WIDTH/2) newX = GAME_WIDTH - PLAYER_WIDTH/2;
      
      if (newX < prev - 1) setPlayerDirection("left");
      else if (newX > prev + 1) setPlayerDirection("right");
      
      return newX;
    });
  };

  const handleMouseMove = (e) => handlePointerMove(e.clientX);
  const handleTouchMove = (e) => handlePointerMove(e.touches[0].clientX);

  const update = (time) => {
    if (stateRef.current.gameState !== "playing") {
      requestRef.current = requestAnimationFrame(update);
      return;
    }

    const { momoX, playerX, berries, score, level, startTime } = stateRef.current;
    
    // Update Timer
    if (startTime > 0) {
       setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }

    const isBossChallenge = score >= 20;
    const momoSpeed = isBossChallenge ? 5 : 3;
    let dropInterval = isBossChallenge ? 500 : 1000;
    if (level === 3) dropInterval = isBossChallenge ? 1200 : 2000;
    const baseBerrySpeed = isBossChallenge ? 6 : 4;

    let newMomoX = momoX;
    if (level === 3) {
      newMomoX = 180; // Sit on the coconut tree on the left
    } else {
      newMomoX = momoX + momoDirectionRef.current * momoSpeed;
      if (newMomoX < MOMO_WIDTH / 2 || newMomoX > GAME_WIDTH - MOMO_WIDTH / 2) {
        momoDirectionRef.current *= -1; 
        newMomoX = Math.max(MOMO_WIDTH / 2, Math.min(newMomoX, GAME_WIDTH - MOMO_WIDTH / 2));
      }
      if (Math.random() < 0.02) {
        momoDirectionRef.current *= -1;
      }
    }

    setMomoX(newMomoX);

    if (time - lastDropTimeRef.current > dropInterval) {
      let vx = 0;
      if (level === 3) {
         // Throw intentionally to diff nearby areas (arc from left to right)
         vx = 1.5 + Math.random() * 4; 
      }
      setBerries((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          x: newMomoX,
          y: level === 3 ? 120 : 70, // Start slightly lower if on the tree
          speed: level === 3 ? 1 : baseBerrySpeed + Math.random() * 2, // Start slower for arc in level 3
          vx: vx,
          status: "falling",
        },
      ]);
      lastDropTimeRef.current = time;
    }

    setBerries((prevBerries) => {
      let newScore = score;
      let newEvent = null;
      
      const updatedBerries = prevBerries
        .map((berry) => {
          if (berry.status !== "falling") return berry;

          let newSpeed = berry.speed;
          if (level === 3) {
             newSpeed += 0.15; // Gravity accelerates falling coconut
          }
          const newY = berry.y + newSpeed;
          const newX = berry.x + (berry.vx || 0);

          const distanceX = Math.abs(newX - playerX);

          if (level === 1) {
            // Level 1 logic (Catch in mouth)
            const playerHeadY = GAME_HEIGHT - 130 + 15;
            const playerMouthY = GAME_HEIGHT - 130 + 25; 
            const mouthX = playerDirection === "right" ? playerX - 5 : playerX + 5;
            const distToMouth = Math.abs(newX - mouthX);
            
            if (newY >= playerMouthY - 20 && newY <= playerMouthY + 20) {
              if (distToMouth < 15) { // Require proper balance and accuracy
                if (newY >= playerMouthY) {
                  newScore += 1;
                  const yummyQuotes = ["Yummy!", "Tasty!", "Sweet!", "Delicious!", "Yum!", "Got it!"];
                  const quote = yummyQuotes[Math.floor(Math.random() * yummyQuotes.length)];
                  newEvent = { type: "caught", x: playerX, y: playerMouthY, text: quote };
                  return { ...berry, x: newX, y: newY, status: "caught" };
                }
              } 
              else if (distanceX >= 35 && distanceX < 48 && newY >= playerHeadY && newY < playerMouthY - 5) {
                const laughType = ["laughing_stand", "laughing_roll", "laughing_point"][Math.floor(Math.random() * 3)];
                newEvent = { type: "hit_face", x: playerX, y: playerHeadY, laughType };
                return { ...berry, x: newX, y: newY, status: "hit_face" };
              }
            }
          } else if (level === 2) {
            // Level 2 logic (Catch in basket)
            const basketTopY = GAME_HEIGHT - 130 + 50; 
            
            // Width is 180. Center of SVG is 90. 
            // Basket center is 35. Offset is 55 pixels left of center.
            const basketCenterX = playerDirection === "right" ? playerX + 55 : playerX - 55;
            const distToBasketCenter = Math.abs(newX - basketCenterX);
            const bodyCenterX = playerDirection === "right" ? playerX - 30 : playerX + 30;

            if (newY >= basketTopY - 15 && newY <= basketTopY + 20) {
               if (distToBasketCenter < 45) { // Very fair catching radius to prevent visual misses
                  if (newY >= basketTopY + 8) { // Doesn't fall too deep
                    newScore += 1;
                    newEvent = { type: "caught", x: basketCenterX, y: basketTopY, text: "Gotcha!" };
                    return { ...berry, x: newX, y: newY, status: "caught" };
                  }
               } else if (Math.abs(newX - bodyCenterX) < 30) {
                  // Hit player body
                  newEvent = { type: "hit_face", x: bodyCenterX, y: basketTopY, laughType: "laughing_point" };
                  return { ...berry, x: newX, y: newY, status: "hit_face" };
               }
             }
          } else if (level === 3) {
            // Level 3 logic (Cricket Catch - Auto Stance)
            const distToCenter = Math.abs(newX - playerX);
            
            // Intelligent Auto-Stance logic
            let autoPosture = "flat_catch";
            if (distToCenter < 25) {
                autoPosture = "high_catch";
            } else if (distToCenter >= 25 && distToCenter < 60) {
                autoPosture = "one_handed";
            } else if (distToCenter >= 60 && distToCenter < 110) {
                autoPosture = "diving";
            }

            // Determine active hitbox based strictly on autoPosture
            let targetY = GAME_HEIGHT - 230 + 90; // flat_catch
            let text = "Great Catch!";

            if (autoPosture === "high_catch") {
                targetY = GAME_HEIGHT - 230 + 10;
                text = "Perfect High!";
            } else if (autoPosture === "one_handed") {
                targetY = GAME_HEIGHT - 230 + 50;
                text = "One Handed!";
            } else if (autoPosture === "diving") {
                targetY = GAME_HEIGHT - 230 + 10 - 80;
                text = "What a Dive!";
            }

            const hitY = newY >= targetY - 25 && newY <= targetY + 25;

            // If the coconut reaches the target Y
            if (newY >= targetY - 5) {
                // Because autoPosture inherently matches the distance, we just check hitY
                if (hitY && distToCenter < 110) {
                    newScore += 1;
                    newEvent = { type: "caught", x: playerX, y: targetY - 20, text, catchStyle: autoPosture };
                    return { ...berry, x: newX, y: newY, status: "caught" };
                } 
                // If it falls past their chest, they missed!
                else if (newY >= GAME_HEIGHT - 230 + 90) {
                    newEvent = { type: "hit_face", x: playerX, y: GAME_HEIGHT - 230 + 90, laughType: "laughing_point" };
                    return { ...berry, x: newX, y: newY, status: "hit_face" };
                }
            }
          }

          if (newY > GAME_HEIGHT) {
            return { ...berry, x: newX, y: newY, status: "missed" };
          }

          return { ...berry, x: newX, y: newY, speed: newSpeed };
        })
        .filter((berry) => berry.status === "falling");

      if (newEvent) {
        setSceneEvent({ ...newEvent, time: Date.now() });
      }

      if (newScore !== score) {
        setScore(newScore);
        if (newScore >= WIN_SCORE) {
          setFinalTime(Math.floor((Date.now() - startTime) / 1000));
          if (level === 1 || level === 2) {
             setGameState("level_won");
          } else {
             setGameState("game_won");
          }
        }
      }

      return updatedBerries;
    });

    setSceneEvent((prev) => {
      if (prev && Date.now() - prev.time > 1500) return null;
      return prev;
    });

    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const startGame = (lvl) => {
    setGameState("playing");
    setLevel(lvl);
    setScore(0);
    setBerries([]);
    setMomoX(GAME_WIDTH / 2);
    setPlayerX(GAME_WIDTH / 2);
    setPlayerDirection("right");
    lastDropTimeRef.current = performance.now();
    setSceneEvent(null);
    setStartTime(Date.now());
    setElapsedTime(0);
  };

  // Derived state for reactions
  const isEventActive = sceneEvent && Date.now() - sceneEvent.time < 1500;
  const momoExpression = isEventActive ? (sceneEvent.type === "hit_face" ? "laughing" : "surprised") : "normal";
  const bgChildrenReaction = isEventActive ? (sceneEvent.type === "hit_face" ? sceneEvent.laughType : "cheering") : "idle";
  const isHit = isEventActive && sceneEvent.type === "hit_face";

  // Calculate dynamic head tilt
  const lowestBerry = berries
    .filter((b) => b.status === "falling")
    .sort((a, b) => b.y - a.y)[0];

  let headTilt = 20; // Default look slightly up
  if (gameState === "playing" && lowestBerry && level === 1) {
    const distanceX = Math.abs(lowestBerry.x - playerX);
    if (distanceX < 100) {
      const playerMouthY = GAME_HEIGHT - 130 + 35; 
      const tiltFactor = Math.max(0, Math.min(1, (lowestBerry.y - 70) / (playerMouthY - 100)));
      headTilt = 20 + tiltFactor * 65; 
    }
  } else if (gameState !== "playing") {
    headTilt = 0; 
  }

  const CurrentFruit = level === 1 ? BlackberrySVG : level === 2 ? GuavaSVG : CoconutSVG;
  const TreeBg = level === 1 ? "/blackberry_tree_bg.png" : level === 2 ? "/guava_tree_bg.png" : "/coconut_tree_bg.png";

  let activeRenderPosture = "flat_catch";
  if (level === 3 && berries.length > 0) {
    const fallingBerries = berries.filter(b => b.status === "falling");
    if (fallingBerries.length > 0) {
      const lowestBerry = fallingBerries.reduce((prev, curr) => (prev.y > curr.y) ? prev : curr);
      const dist = Math.abs(lowestBerry.x - playerX);
      if (dist < 25) activeRenderPosture = "high_catch";
      else if (dist >= 25 && dist < 60) activeRenderPosture = "one_handed";
      else if (dist >= 60 && dist < 110) activeRenderPosture = "diving";
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center py-8 px-4 font-sans text-white touch-none">
      <div className="w-full max-w-[600px] flex items-center justify-between mb-6 z-10">
        <Link
          href="/games"
          className="flex items-center text-slate-300 hover:text-white transition-colors bg-slate-800 px-4 py-2 rounded-lg shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Link>
        <div className="flex items-center gap-4">
          <div className="bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-700 flex items-center gap-2 shadow-xl backdrop-blur-sm">
            <Clock className="w-5 h-5 text-slate-400" />
            <span className="font-mono text-xl">{elapsedTime}s</span>
          </div>
          <div className="bg-purple-600/30 px-4 py-2 rounded-lg border border-purple-500/50 flex items-center gap-3 shadow-xl backdrop-blur-sm">
            <div className="w-6 h-6"><CurrentFruit /></div>
            <span className="font-bold text-2xl">{score} / {WIN_SCORE}</span>
          </div>
        </div>
      </div>

      <div 
        ref={gameContainerRef}
        className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-700 mx-auto w-full bg-sky-200"
        style={{ maxWidth: GAME_WIDTH, aspectRatio: "1/1", maxHeight: '70vh' }}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        <div 
          className="absolute inset-0 origin-top-left"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT, transform: `scale(var(--scale-factor, 1))` }}
          ref={(node) => {
            if (node && gameContainerRef.current) {
               const rect = gameContainerRef.current.getBoundingClientRect();
               node.style.setProperty('--scale-factor', rect.width / GAME_WIDTH);
            }
          }}
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
             <Image 
               src={TreeBg}
               alt="Tree Background" 
               fill
               priority
               className="object-cover"
             />
             <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {gameState === "playing" && (
            <>
              {/* Background Children - Moved near tree trunk (bottom right side) */}
              <div className="absolute z-10 opacity-90 transition-all duration-300" style={{ bottom: '150px', left: '380px', transform: 'scale(0.7)' }}>
                <BackgroundChildSVG reaction={bgChildrenReaction} color="#10B981" hairColor="#451A03" />
              </div>
              <div className="absolute z-10 opacity-90 transition-all duration-300" style={{ bottom: '160px', left: '460px', transform: 'scale(0.7) scaleX(-1)' }}>
                {/* Wrap in another div to prevent scaleX(-1) from affecting rotate logic */}
                <div style={{ transform: 'scaleX(-1)' }}>
                   <BackgroundChildSVG reaction={bgChildrenReaction} color="#8B5CF6" hairColor="#FEF3C7" />
                </div>
              </div>

              {/* Momo */}
              <div 
                className="absolute top-2 transform -translate-x-1/2 transition-transform duration-75 z-20"
                style={{ left: momoX }}
              >
                <MonkeySVG expression={momoExpression} />
              </div>

              {score >= 20 && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-600/60 font-black text-6xl tracking-widest text-center pointer-events-none z-10 whitespace-nowrap drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                  BOSS MODE
                </div>
              )}

              {/* Main Player Back */}
          <div
            className="absolute bottom-0 transform -translate-x-1/2 z-20 transition-transform duration-100 pointer-events-none"
            style={{ left: playerX }}
          >
            {level === 1 ? (
              <ChildSVG isHit={isHit} direction={playerDirection} headTilt={headTilt} />
            ) : level === 2 ? (
              <BasketChildBackSVG isHit={isHit} direction={playerDirection} score={score} />
            ) : (
              <CricketManSVG catchStyle={sceneEvent && sceneEvent.type === "caught" ? sceneEvent.catchStyle : activeRenderPosture} direction={playerDirection} />
            )}
          </div>

              {/* Falling Fruits */}
              {berries.map((berry) => (
                <div
                  key={berry.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                  style={{ left: berry.x, top: berry.y }}
                >
                  <CurrentFruit />
                </div>
              ))}

              {/* Main Player Front (For Level 2 only) */}
              {level === 2 && (
                <div
                  className="absolute bottom-0 transform -translate-x-1/2 z-40 transition-transform duration-100 pointer-events-none"
                  style={{ left: playerX }}
                >
                   <BasketChildFrontSVG direction={playerDirection} />
                </div>
              )}

              {/* Ground Coconuts (Level 3) */}
              {level === 3 && (
                <div className="absolute bottom-[20px] right-[40px] z-30 pointer-events-none drop-shadow-xl">
                  {Array.from({ length: score }).map((_, i) => (
                    <div 
                      key={`ground-coconut-${i}`} 
                      className="absolute bottom-0 right-0 transform"
                      style={{
                        transform: `translate(${-((i % 6) * 15 + (i * 7) % 8)}px, ${-Math.floor(i / 6) * 10 + (i * 3) % 4}px) scale(0.6) rotate(${(i * 15) % 360}deg)`,
                        transformOrigin: 'center center'
                      }}
                    >
                      <CoconutSVG />
                    </div>
                  ))}
                </div>
              )}

              {/* Reactions */}
              {sceneEvent && sceneEvent.type === "hit_face" && (
                <div
                  className="absolute text-5xl animate-bounce z-40 drop-shadow-xl"
                  style={{ left: sceneEvent.x - 40, top: sceneEvent.y - 60 }}
                >
                  <div className="bg-white text-black text-lg font-bold px-4 py-2 rounded-full border-4 border-slate-200">
                    Ouch! 💥
                  </div>
                </div>
              )}
              {sceneEvent && sceneEvent.type === "caught" && (
                <div
                  className="absolute text-3xl animate-bounce z-40 drop-shadow-xl"
                  style={{ left: sceneEvent.x + 20, top: sceneEvent.y - 60 }}
                >
                  <div className="bg-green-400 text-green-950 text-lg font-bold px-4 py-2 rounded-full border-4 border-green-200 whitespace-nowrap">
                    {sceneEvent.text}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Intro Overlay */}
          {gameState === "intro" && (
            <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center p-6 text-center z-50 backdrop-blur-sm">
              <div className="bg-slate-800 p-8 rounded-3xl max-w-sm border border-slate-700 shadow-2xl">
                <h1 className="text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-sm">
                  Monkey Fruit Drop
                </h1>
                <div className="text-slate-300 space-y-4 mb-8 text-left text-[15px] leading-relaxed">
                  <p>
                    In the colorful village of Fruitania, a mischievous monkey named <b className="text-white">Momo</b> loves sitting on fruit trees and teasing children.
                  </p>
                  <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700/50">
                    <h3 className="font-bold text-white mb-3 text-lg flex items-center gap-2">
                      <div className="w-6 h-6"><BlackberrySVG /></div> Level 1: Blackberry Tree
                    </h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400">
                      <li>Catch <b className="text-white">{WIN_SCORE}</b> blackberries in your mouth!</li>
                      <li>Watch out: If it hits your head, the other kids will laugh!</li>
                      <li>Move left & right using your <b className="text-white">mouse</b>, <b className="text-white">touch</b>, or <b className="text-white">arrow keys</b>.</li>
                    </ul>
                  </div>
                </div>
                <button
                  onClick={() => startGame(1)}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold text-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-purple-600/20"
                >
                  <Play className="w-7 h-7 fill-current" />
                  Play Level 1
                </button>
              </div>
            </div>
          )}

          {/* Level 1 & 2 Won Overlay */}
          {gameState === "level_won" && (
            <div className="absolute inset-0 bg-slate-900/90 flex items-center justify-center p-6 text-center z-50 backdrop-blur-sm">
              <div className="bg-slate-800 p-8 rounded-3xl max-w-sm border-2 border-green-500/50 shadow-[0_0_80px_rgba(34,197,94,0.3)]">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <Trophy className="w-full h-full text-green-400 drop-shadow-lg" />
                  <div className="absolute inset-0 bg-green-400/20 blur-xl rounded-full"></div>
                </div>
                <h2 className="text-4xl font-black mb-3 text-white tracking-tight">Level {level} Clear!</h2>
                <p className="text-slate-300 mb-6 text-lg">
                  You caught {WIN_SCORE} {level === 1 ? 'blackberries' : 'guavas'} in <b className="text-white">{finalTime} seconds</b>! 
                </p>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 mb-8 text-left">
                    {level === 1 ? (
                        <>
                          <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                            <div className="w-5 h-5"><GuavaSVG /></div> Level 2: Guava Tree
                          </h3>
                          <p className="text-sm text-slate-400">
                            Momo moved to the Guava tree! Grab your basket and catch {WIN_SCORE} guavas!
                          </p>
                        </>
                    ) : (
                        <>
                          <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                            <div className="w-5 h-5"><CoconutSVG /></div> Level 3: Coconut Tree
                          </h3>
                          <p className="text-sm text-slate-400">
                            Momo moved to the Coconut tree! Show off your cricket catching skills and catch {WIN_SCORE} coconuts!
                          </p>
                        </>
                    )}
                </div>
                <button
                  onClick={() => startGame(level + 1)}
                  className="w-full py-4 bg-green-500 hover:bg-green-400 text-green-950 rounded-xl font-bold text-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-green-500/20"
                >
                  <Play className="w-6 h-6" />
                  Start Level {level + 1}
                </button>
              </div>
            </div>
          )}

          {/* Game Won Overlay */}
          {gameState === "game_won" && (
            <div className="absolute inset-0 bg-slate-900/90 flex items-center justify-center p-6 text-center z-50 backdrop-blur-sm">
              <div className="bg-slate-800 p-8 rounded-3xl max-w-sm border-2 border-yellow-500/50 shadow-[0_0_80px_rgba(234,179,8,0.3)]">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <Trophy className="w-full h-full text-yellow-400 drop-shadow-lg" />
                  <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full"></div>
                </div>
                <h2 className="text-4xl font-black mb-3 text-white tracking-tight">Champion!</h2>
                <p className="text-slate-300 mb-8 text-lg">
                  You outsmarted Momo across all 3 levels and caught {WIN_SCORE} coconuts in <b className="text-white">{finalTime} seconds</b>! You've beaten the game!
                </p>
                <button
                  onClick={() => setGameState("intro")}
                  className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-yellow-950 rounded-xl font-bold text-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/20"
                >
                  <RefreshCw className="w-6 h-6" />
                  Play Again from Start
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
