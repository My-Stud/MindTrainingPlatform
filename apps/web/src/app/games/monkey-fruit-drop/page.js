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

const MonkeySVG = ({ expression = "normal", isTeacher = false }) => (
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

    {/* Teacher Glasses */}
    {isTeacher && (
      <g>
        <rect x="36" y="30" width="20" height="15" rx="3" fill="rgba(255,255,255,0.2)" stroke="#1E40AF" strokeWidth="2.5"/>
        <rect x="64" y="30" width="20" height="15" rx="3" fill="rgba(255,255,255,0.2)" stroke="#1E40AF" strokeWidth="2.5"/>
        <line x1="56" y1="37" x2="64" y2="37" stroke="#1E40AF" strokeWidth="2.5"/>
        <line x1="26" y1="37" x2="36" y2="37" stroke="#1E40AF" strokeWidth="2.5"/>
        <line x1="84" y1="37" x2="94" y2="37" stroke="#1E40AF" strokeWidth="2.5"/>
      </g>
    )}

    {/* Teacher Tie */}
    {isTeacher && (
      <g>
        <path d="M 56,76 L 64,76 L 60,98 Z" fill="#EF4444"/>
        <polygon points="60,76 57,72 63,72" fill="#B91C1C"/>
      </g>
    )}
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

const FloatingMatSVG = () => (
  <svg width="200" height="80" viewBox="0 0 200 80" className="drop-shadow-2xl">
    {/* Mat Base */}
    <ellipse cx="100" cy="40" rx="90" ry="25" fill="#C026D3"/>
    <ellipse cx="100" cy="38" rx="85" ry="22" fill="#D946EF"/>
    {/* Patterns */}
    <path d="M 25,38 Q 100,10 175,38" fill="none" stroke="#FDE047" strokeWidth="4" strokeDasharray="6,6"/>
    <path d="M 35,45 Q 100,20 165,45" fill="none" stroke="#2DD4BF" strokeWidth="3" strokeDasharray="4,4"/>
    <ellipse cx="100" cy="40" rx="75" ry="15" fill="none" stroke="#FBBF24" strokeWidth="2"/>
    
    {/* Tassels hanging off the edge */}
    <line x1="15" y1="40" x2="10" y2="55" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/>
    <line x1="25" y1="45" x2="20" y2="60" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/>
    <line x1="175" y1="45" x2="180" y2="60" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/>
    <line x1="185" y1="40" x2="190" y2="55" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/>

    {/* Magical glowing aura underneath */}
    <ellipse cx="100" cy="50" rx="70" ry="15" fill="#E879F9" opacity="0.7" filter="blur(6px)"/>
    {/* Sparkles */}
    <circle cx="30" cy="20" r="3" fill="#FFF" opacity="0.8" className="animate-pulse"/>
    <circle cx="160" cy="60" r="2" fill="#FFF" opacity="0.8" className="animate-pulse"/>
    <circle cx="170" cy="25" r="4" fill="#FDE047" opacity="0.9" className="animate-pulse"/>
    <circle cx="40" cy="65" r="2.5" fill="#2DD4BF" opacity="0.9" className="animate-pulse"/>
  </svg>
);

const BookSVG = () => (
  <svg width="60" height="40" viewBox="0 0 60 40" className="drop-shadow-md">
    <path d="M 30,35 L 5,25 L 30,10 L 55,25 Z" fill="#FCD34D" stroke="#B45309" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M 30,35 L 5,25 L 5,20 L 30,30 Z" fill="#FEF3C7"/>
    <path d="M 30,35 L 55,25 L 55,20 L 30,30 Z" fill="#FFFBEB"/>
    <line x1="30" y1="10" x2="30" y2="35" stroke="#B45309" strokeWidth="2"/>
  </svg>
);

// --- Level 10+ Additions ---
const level10Questions = [
  { prompt: "Find the word: APPLE", target: "APPLE", correct: "APPLE", traps: ["APPLEE", "APLE", "APPEL", "APEL"], objectSvg: "apple" },
  { prompt: "Find formula for WATER", target: "WATER", correct: "H2O", traps: ["H2O2", "HO2", "H3O", "CO2"], objectSvg: "water" },
  { prompt: "Find capital of INDIA", target: "INDIA", correct: "Delhi", traps: ["Mumbai", "Kolkata", "Chennai", "Pune"], objectSvg: "india" },
  { prompt: "Find the word: BIRD", target: "BIRD", correct: "BIRD", traps: ["BRID", "BRED", "BORD", "BERD"], objectSvg: "bird" },
  { prompt: "Find capital of FRANCE", target: "FRANCE", correct: "Paris", traps: ["London", "Berlin", "Rome", "Madrid"], objectSvg: "france" },
  { prompt: "Calculate: 3 + 4", target: "MATH1", correct: "7", traps: ["6", "8", "9", "5"], objectSvg: "math" },
  { prompt: "Find the word: TIGER", target: "TIGER", correct: "TIGER", traps: ["TIGRE", "TEGIR", "TIGAR", "TYGER"], objectSvg: "tiger" },
  { prompt: "Find capital of JAPAN", target: "JAPAN", correct: "Tokyo", traps: ["Kyoto", "Osaka", "Seoul", "Beijing"], objectSvg: "japan" },
  { prompt: "Calculate: 5 x 5", target: "MATH2", correct: "25", traps: ["20", "30", "15", "10"], objectSvg: "math" },
  { prompt: "Opposite of HOT", target: "OPPOSITE", correct: "COLD", traps: ["WARM", "COOL", "SUN", "FIRE"], objectSvg: "opposite" },
  { prompt: "Calculate: 15 x 4", target: "MATH3", correct: "60", traps: ["50", "55", "65", "45"], objectSvg: "math" },
  { prompt: "What is 20% of 50?", target: "MATH4", correct: "10", traps: ["20", "5", "15", "25"], objectSvg: "math" },
  { prompt: "Square root of 144", target: "MATH5", correct: "12", traps: ["14", "16", "10", "11"], objectSvg: "math" },
  { prompt: "Find capital of CANADA", target: "CANADA", correct: "Ottawa", traps: ["Toronto", "Vancouver", "Montreal", "Quebec"], objectSvg: "canada" },
  { prompt: "Find capital of AUSTRALIA", target: "AUSTRALIA", correct: "Canberra", traps: ["Sydney", "Melbourne", "Brisbane", "Perth"], objectSvg: "australia" },
  { prompt: "Opposite of BRAVE", target: "OPPOSITE2", correct: "COWARD", traps: ["STRONG", "FEAR", "WEAK", "SMART"], objectSvg: "opposite" },
  { prompt: "Calculate: 100 / 4", target: "MATH6", correct: "25", traps: ["20", "30", "15", "50"], objectSvg: "math" },
  { prompt: "Find the word: PLANET", target: "PLANET", correct: "PLANET", traps: ["PLANIT", "PLENAT", "PLANOT", "PLANT"], objectSvg: "planet" },
  { prompt: "What is 7 cubed?", target: "MATH7", correct: "343", traps: ["21", "49", "128", "256"], objectSvg: "math" },
  { prompt: "Opposite of EXPAND", target: "OPPOSITE3", correct: "SHRINK", traps: ["GROW", "STRETCH", "HIDE", "SMALL"], objectSvg: "opposite" }
];

const level11Memory = [
  { sequence: ["APPLE", "BANANA", "MANGO"], question: "Which fruit was second?", correct: "BANANA", traps: ["APPLE", "MANGO", "ORANGE"], objectSvg: "banana" },
  { sequence: ["LION", "TIGER", "BEAR"], question: "Which animal was first?", correct: "LION", traps: ["TIGER", "BEAR", "WOLF"], objectSvg: "lion" },
  { sequence: ["RED", "BLUE", "GREEN"], question: "Which color was last?", correct: "GREEN", traps: ["RED", "BLUE", "YELLOW"], objectSvg: "green" },
  { sequence: ["CAR", "BUS", "TRAIN"], question: "Which vehicle was second?", correct: "BUS", traps: ["CAR", "TRAIN", "BIKE"], objectSvg: "bus" },
  { sequence: ["ONE", "TWO", "THREE"], question: "Which number was first?", correct: "ONE", traps: ["TWO", "THREE", "FOUR"], objectSvg: "one" },
  { sequence: ["SUN", "MOON", "STAR"], question: "Which object was last?", correct: "STAR", traps: ["SUN", "MOON", "CLOUD"], objectSvg: "star" }
];

const colorThemes = [
  "bg-gradient-to-r from-cyan-400 to-blue-500 border-white text-white",
  "bg-gradient-to-r from-fuchsia-500 to-pink-500 border-white text-white",
  "bg-gradient-to-r from-amber-400 to-orange-500 border-white text-white",
  "bg-gradient-to-r from-emerald-400 to-green-500 border-white text-white",
  "bg-gradient-to-r from-violet-500 to-purple-600 border-white text-white",
];

const level12Boss = {
  target: "FRUITS",
  correctWords: ["APPLE", "BANANA", "MANGO", "GRAPE", "KIWI", "PEACH"],
  trapWords: ["POTATO", "CARROT", "ONION", "GARLIC", "CELERY", "BROCCOLI"],
  objectSvg: "apple"
};

const AppleSVG = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" className="drop-shadow-md">
    <path d="M 20,35 Q 10,35 10,20 Q 10,10 20,10 Q 30,10 30,20 Q 30,35 20,35" fill="#EF4444"/>
    <path d="M 20,10 Q 22,5 25,2" fill="none" stroke="#654321" strokeWidth="3"/>
    <path d="M 25,2 Q 30,2 32,5 Z" fill="#22C55E"/>
  </svg>
);

const WaterSVG = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" className="drop-shadow-md">
    <path d="M 20,5 Q 10,20 10,30 A 10,10 0 0,0 30,30 Q 30,20 20,5 Z" fill="#3B82F6"/>
  </svg>
);

const FlagSVG = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" className="drop-shadow-md">
    <rect x="5" y="10" width="30" height="6" fill="#FF9933"/>
    <rect x="5" y="16" width="30" height="6" fill="#FFFFFF"/>
    <rect x="5" y="22" width="30" height="6" fill="#138808"/>
    <circle cx="20" cy="19" r="2.5" fill="#000080"/>
  </svg>
);

const BubbleSVG = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" className="opacity-80">
    <circle cx="10" cy="10" r="9" fill="#93C5FD" stroke="#60A5FA" strokeWidth="2" opacity="0.6"/>
    <circle cx="7" cy="7" r="3" fill="#FFFFFF" opacity="0.8"/>
  </svg>
);

const BubbleShooterChildBackSVG = ({ isHit, direction = "right", score = 0 }) => {
  return (
    <svg width="180" height="150" viewBox="0 0 180 150" className="drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)]" style={{ transform: direction === "right" ? "scaleX(-1)" : "none", transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)" }}>
      {/* Back Arm */}
      <path d="M 100,85 L 85,50" fill="none" stroke="#1E293B" strokeWidth="8" strokeLinecap="round"/>
      
      {/* Blaster rotated around hand to point upwards */}
      <g transform="rotate(45 85 50)">
        <circle cx="85" cy="50" r="5" fill="#334155"/>
        {/* Sci-fi Bubble Blaster (Back layer) */}
        <rect x="55" y="30" width="35" height="15" rx="5" fill="#0F172A" />
        <path d="M 55,30 Q 40,30 40,40 Q 40,50 55,50" fill="#38BDF8" />
        {/* Glowing Energy Core */}
        <circle cx="50" cy="40" r="5" fill="#BAE6FD" filter="blur(2px)"/>
        <circle cx="50" cy="40" r="2" fill="#FFFFFF"/>
      </g>
      
      {/* Legs (Stylized pants) */}
      <rect x="105" y="100" width="10" height="40" rx="3" fill="#0F172A"/>
      <rect x="125" y="100" width="10" height="40" rx="3" fill="#0F172A"/>
      {/* Sci-fi Sneakers */}
      <ellipse cx="110" cy="140" rx="12" ry="6" fill="#38BDF8"/>
      <ellipse cx="130" cy="140" rx="12" ry="6" fill="#38BDF8"/>
      <rect x="100" y="137" width="20" height="4" fill="#E0F2FE"/>
      <rect x="120" y="137" width="20" height="4" fill="#E0F2FE"/>
      
      {/* Body (Cool Jacket) */}
      <path d="M 95,60 Q 120,50 140,65 L 140,105 Q 120,110 95,105 Z" fill="#0284C7"/>
      <path d="M 115,60 L 115,105" stroke="#38BDF8" strokeWidth="3"/>
      
      {/* Head Group */}
      <g style={{ transformOrigin: "120px 45px", transform: isHit ? "rotate(-10deg)" : "none", transition: "transform 0.1s" }}>
        {/* Cool spiky hair */}
        <path d="M 100,25 Q 120,-5 145,25 Z" fill="#1E293B"/>
        <path d="M 130,5 Q 145,0 145,25" stroke="#1E293B" strokeWidth="6" fill="none"/>
        <circle cx="120" cy="35" r="22" fill="#FDBA74"/>
        {/* Face */}
        <ellipse cx="108" cy="30" rx="4" ry="6" fill="#0F172A"/>
        <circle cx="107" cy="28" r="1.5" fill="#FFF"/>
        {/* Futuristic Visor */}
        <rect x="95" y="25" width="20" height="8" rx="4" fill="#0EA5E9" opacity="0.8"/>
        <path d="M 98,42 Q 105,48 112,42" fill="none" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
    </svg>
  );
};

const BubbleShooterChildFrontSVG = ({ direction = "right" }) => {
  return (
    <svg width="180" height="150" viewBox="0 0 180 150" className="drop-shadow-[0_10px_10px_rgba(0,0,0,0.4)]" style={{ transform: direction === "right" ? "scaleX(-1)" : "none", transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)" }}>
      {/* Front Arm (Right hand) aiming blaster */}
      <path d="M 120,70 L 95,50" fill="none" stroke="#0284C7" strokeWidth="10" strokeLinecap="round"/>
      
      {/* Blaster rotated around hand to point upwards */}
      <g transform="rotate(45 95 50)">
        {/* Blaster Front Section */}
        <rect x="75" y="32" width="25" height="12" rx="3" fill="#E2E8F0"/>
        <rect x="70" y="30" width="10" height="16" rx="2" fill="#94A3B8"/>
        {/* Energy Rings */}
        <rect x="60" y="28" width="5" height="20" rx="2" fill="#38BDF8" className="animate-pulse"/>
        <rect x="68" y="29" width="4" height="18" rx="2" fill="#BAE6FD"/>
        {/* Barrel */}
        <path d="M 45,34 L 60,34 L 60,42 L 45,42 Z" fill="#1E293B"/>
        {/* Bubble emitting from barrel */}
        <circle cx="40" cy="38" r="8" fill="none" stroke="#BAE6FD" strokeWidth="2" opacity="0.6"/>
        <circle cx="40" cy="38" r="4" fill="#38BDF8" opacity="0.8"/>
        <circle cx="95" cy="50" r="5.5" fill="#FDBA74"/>
      </g>
    </svg>
  );
};

const ElephantSVG = ({ expression = "normal" }) => (
  <svg width="120" height="130" viewBox="0 0 120 130" className="drop-shadow-xl">
    {/* Body */}
    <ellipse cx="60" cy="90" rx="40" ry="35" fill="#9CA3AF"/>
    <ellipse cx="60" cy="95" rx="30" ry="25" fill="#D1D5DB"/>
    {/* Legs */}
    <rect x="30" y="110" width="16" height="20" rx="4" fill="#9CA3AF"/>
    <rect x="74" y="110" width="16" height="20" rx="4" fill="#9CA3AF"/>
    {/* Ears */}
    <path d="M 40,50 C 10,20 0,60 25,80 Z" fill="#9CA3AF"/>
    <path d="M 40,50 C 15,25 10,55 25,75 Z" fill="#F472B6" opacity="0.5"/>
    <path d="M 80,50 C 110,20 120,60 95,80 Z" fill="#9CA3AF"/>
    <path d="M 80,50 C 105,25 110,55 95,75 Z" fill="#F472B6" opacity="0.5"/>
    {/* Head */}
    <circle cx="60" cy="55" r="30" fill="#9CA3AF"/>
    {/* Trunk */}
    <path d="M 50,65 Q 60,110 70,100 Q 60,105 58,65 Z" fill="#9CA3AF"/>
    {/* Eyes */}
    {expression === "surprised" ? (
      <>
        <circle cx="48" cy="45" r="7" fill="#fff"/>
        <circle cx="72" cy="45" r="7" fill="#fff"/>
        <circle cx="48" cy="45" r="3" fill="#000"/>
        <circle cx="72" cy="45" r="3" fill="#000"/>
      </>
    ) : (
      <>
        <circle cx="48" cy="48" r="4" fill="#000"/>
        <circle cx="72" cy="48" r="4" fill="#000"/>
        <circle cx="46" cy="46" r="1.5" fill="#fff"/>
        <circle cx="70" cy="46" r="1.5" fill="#fff"/>
      </>
    )}
    {/* Rosy Cheeks */}
    <circle cx="38" cy="55" r="6" fill="#FCA5A5" fillOpacity="0.6"/>
    <circle cx="82" cy="55" r="6" fill="#FCA5A5" fillOpacity="0.6"/>
    {/* Tusks */}
    <path d="M 48,70 Q 40,85 45,95 Q 46,90 49,70 Z" fill="#fff"/>
    <path d="M 72,70 Q 80,85 75,95 Q 74,90 71,70 Z" fill="#fff"/>
  </svg>
);

export default function MonkeyFruitDrop() {
  const [gameState, setGameState] = useState("intro"); // "intro", "playing", "level_won", "game_won"
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  
  const [momoX, setMomoX] = useState(GAME_WIDTH / 2);
  const [playerX, setPlayerX] = useState(GAME_WIDTH / 2);
  const [playerDirection, setPlayerDirection] = useState("right");
  const [berries, setBerries] = useState([]); 
  const [bubbles, setBubbles] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [askedQuestions, setAskedQuestions] = useState([]);
  const [memoryPhase, setMemoryPhase] = useState("playing"); // "show", "hide", "playing"
  const [bossTimeLeft, setBossTimeLeft] = useState(0);
  const [sceneEvent, setSceneEvent] = useState(null);
  
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [finalTime, setFinalTime] = useState(0);
  
  const requestRef = useRef();
  const momoDirectionRef = useRef(1); 
  const lastDropTimeRef = useRef(0);
  const lastBossTickRef = useRef(0);
  const gameContainerRef = useRef(null);
  
  const stateRef = useRef({
    momoX: GAME_WIDTH / 2,
    playerX: GAME_WIDTH / 2,
    berries: [],
    bubbles: [],
    score: 0,
    gameState: "intro",
    level: 1,
    startTime: 0,
    currentQuestion: null,
    askedQuestions: [],
    memoryPhase: "playing",
    bossTimeLeft: 0
  });

  useEffect(() => {
    stateRef.current = { momoX, playerX, berries, bubbles, score, gameState, level, startTime, currentQuestion, askedQuestions, memoryPhase, bossTimeLeft };
  }, [momoX, playerX, berries, bubbles, score, gameState, level, startTime, currentQuestion, askedQuestions, memoryPhase, bossTimeLeft]);

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
      } else if (e.key === " ") {
        if (stateRef.current.level >= 3) shootBubble();
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

  const shootBubble = () => {
    const { playerX, level } = stateRef.current;
    if (level < 3) return;
    setBubbles(prev => [...prev, { id: Date.now(), x: playerDirection === 'right' ? playerX + 22 : playerX - 22, y: GAME_HEIGHT - 140 }]);
  };

  const handleClick = () => {
    if (stateRef.current.level >= 3 && stateRef.current.gameState === "playing") shootBubble();
  };

  const update = (time) => {
    if (stateRef.current.gameState !== "playing") {
      requestRef.current = requestAnimationFrame(update);
      return;
    }

    const { momoX, playerX, berries, bubbles, score, level, startTime, currentQuestion, memoryPhase, bossTimeLeft } = stateRef.current;
    
    // Update Timer
    if (startTime > 0) {
       setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }

    if (level === 4 && memoryPhase !== "playing") {
      // Memory phase logic: Just wait for timeouts, which are handled in startGame
      requestRef.current = requestAnimationFrame(update);
      return;
    }

    if (level === 5) {
      if (time - lastBossTickRef.current > 1000) {
        setBossTimeLeft(prev => {
          if (prev <= 1) {
            setGameState("game_won");
            setFinalTime(elapsedTime);
            return 0;
          }
          return prev - 1;
        });
        lastBossTickRef.current = time;
      }
      if (bossTimeLeft <= 0 && time - startTime > 1000) return; // Time's up handled
    }

    const isBossChallenge = score >= 20 || level === 5;
    const momoSpeed = level >= 3 ? (isBossChallenge ? 2.5 : 1.5) : (isBossChallenge ? 5 : 3);
    let dropInterval = isBossChallenge ? 500 : 1000;
    if (level === 3 || level === 4) dropInterval = isBossChallenge ? 1200 : 2500;
    if (level === 5) dropInterval = 300; // Rapid fire
    const baseBerrySpeed = level === 5 ? 8 : (isBossChallenge ? 6 : 4);

    let newMomoX = momoX;

      newMomoX = momoX + momoDirectionRef.current * momoSpeed;
      if (newMomoX < MOMO_WIDTH / 2 || newMomoX > GAME_WIDTH - MOMO_WIDTH / 2) {
        momoDirectionRef.current *= -1; 
        newMomoX = Math.max(MOMO_WIDTH / 2, Math.min(newMomoX, GAME_WIDTH - MOMO_WIDTH / 2));
      }
      if (Math.random() < 0.02) {
        momoDirectionRef.current *= -1;
      }

    setMomoX(newMomoX);

    if (time - lastDropTimeRef.current > dropInterval) {
      let vx = 0;

      let wordData = null;
      let activeQuestion = currentQuestion;
      
      // Fallback if state got mixed up
      if (level >= 3 && !activeQuestion) {
          activeQuestion = level10Questions[0];
      }

      if (level >= 3 && activeQuestion) {
          const isCorrect = Math.random() > (level === 5 ? 0.3 : 0.6);
          let text = "";
          if (level === 5) {
             text = isCorrect ? activeQuestion.correctWords[Math.floor(Math.random() * activeQuestion.correctWords.length)] : activeQuestion.trapWords[Math.floor(Math.random() * activeQuestion.trapWords.length)];
          } else {
             text = isCorrect ? activeQuestion.correct : activeQuestion.traps[Math.floor(Math.random() * activeQuestion.traps.length)];
          }
          wordData = { text, isCorrect, objectSvg: activeQuestion.objectSvg };
      }

      setBerries((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          x: newMomoX,
          y: level >= 3 ? (level === 5 ? 160 : 120) : 70,
          speed: level >= 3 ? 1.2 + Math.random() * 0.8 + (level === 5 ? 2 : 0) : baseBerrySpeed + Math.random() * 2,
          vx: vx,
          status: "falling",
          colorScheme: Math.floor(Math.random() * 5),
          ...wordData
        },
      ]);
      lastDropTimeRef.current = time;
    }

    if (level >= 3) {
      setBubbles(prev => prev.map(b => ({ ...b, y: b.y - 8 })).filter(b => b.y > 0));
    }

    setBerries((prevBerries) => {
      let newScore = score;
      let newEvent = null;
      
      const updatedBerries = prevBerries
        .map((berry) => {
          if (berry.status !== "falling") return berry;

          let newSpeed = berry.speed;
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
             }          } else if (level >= 3) {
            // Clean up any corrupted berries from old state
            if (!berry.text && berry.status === "falling") {
                return { ...berry, status: "missed" }; // Instantly remove broken berries
            }
            
            // Level 3+ logic (Word Shooter - Instant Score)
            if (berry.status === "falling") {
                const hitBubble = bubbles.find(b => Math.abs(b.x - newX) < 60 && Math.abs(b.y - newY) < 50);
                if (hitBubble) {
                    if (berry.isCorrect) {
                        newScore += 1;
                        setCorrectAnswersCount(prev => prev + 1);
                        newEvent = { type: "caught", x: newX, y: newY, text: "Correct!" };
                        return { ...berry, x: newX, y: newY, status: "caught" }; // Instantly caught!
                    } else {
                        newScore = Math.max(0, newScore - 1);
                        newEvent = { type: "caught", x: newX, y: newY, text: "Wrong! -1", isWrong: true };
                        return { ...berry, x: newX, y: newY, status: "missed" }; // Wrong word bursts
                    }
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
        const requiredScore = (level === 3 || level === 4) ? 1 : WIN_SCORE;
        if (newScore >= requiredScore && level !== 12) {
          setFinalTime(Math.floor((Date.now() - startTime) / 1000));
          if (level < 5) {
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

  useEffect(() => {
    if (correctAnswersCount > 0) {
      if (level === 3) {
        setBerries([]);
        setBubbles([]);
        let available = level10Questions.filter(q => !askedQuestions.includes(q.target));
        if (available.length === 0) { available = level10Questions; setAskedQuestions([]); }
        let newQ = available[Math.floor(Math.random() * available.length)];
        setAskedQuestions(prev => [...prev, newQ.target]);
        setCurrentQuestion(newQ);
      } else if (level === 4) {
        setBerries([]);
        setBubbles([]);
        let available = level11Memory.filter(q => !askedQuestions.includes(q.question));
        if (available.length === 0) { available = level11Memory; setAskedQuestions([]); }
        let newQ = available[Math.floor(Math.random() * available.length)];
        setAskedQuestions(prev => [...prev, newQ.question]);
        setCurrentQuestion(newQ);
        setMemoryPhase("show");
        const t1 = setTimeout(() => {
          setMemoryPhase("hide");
          const t2 = setTimeout(() => {
            setMemoryPhase("playing");
          }, 1500);
        }, 3000);
        return () => { clearTimeout(t1); };
      }
    }
  }, [correctAnswersCount, level]);

  const startGame = (lvl) => {
    setGameState("playing");
    setLevel(lvl);
    setScore(0);
    setCorrectAnswersCount(0);
    setBerries([]);
    setBubbles([]);
    setAskedQuestions([]);
    setMomoX(GAME_WIDTH / 2);
    setPlayerX(GAME_WIDTH / 2);
    setPlayerDirection("right");
    lastDropTimeRef.current = performance.now();
    lastBossTickRef.current = performance.now();
    setSceneEvent(null);
    setStartTime(Date.now());
    setElapsedTime(0);
    
    if (lvl === 3 || lvl >= 10) {
      let q = level10Questions[Math.floor(Math.random() * level10Questions.length)];
      setCurrentQuestion(q);
      setAskedQuestions([q.target]);
      setMemoryPhase("playing");
    } else if (lvl === 4) {
      const q = level11Memory[Math.floor(Math.random() * level11Memory.length)];
      setCurrentQuestion(q);
      setAskedQuestions([q.question]);
      setMemoryPhase("show");
      setTimeout(() => setMemoryPhase("hide"), 3000);
      setTimeout(() => setMemoryPhase("playing"), 5000);
    } else if (lvl === 5) {
      setCurrentQuestion(level12Boss);
      setBossTimeLeft(30);
      setMemoryPhase("playing");
    } else {
      setCurrentQuestion(null);
      setMemoryPhase("playing");
    }
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

  const CurrentFruit = level === 1 ? BlackberrySVG : level === 2 ? GuavaSVG : BubbleSVG;
  const TreeBg = level === 1 ? "/blackberry_tree_bg.png" : level === 2 ? "/guava_tree_bg.png" : "";

  let activeRenderPosture = "flat_catch";

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
            <span className="font-mono text-xl">{level === 5 ? bossTimeLeft : elapsedTime}s</span>
          </div>
          <div className="bg-purple-600/30 px-4 py-2 rounded-lg border border-purple-500/50 flex items-center gap-3 shadow-xl backdrop-blur-sm">
            <div className="w-6 h-6"><CurrentFruit /></div>
            <span className="font-bold text-2xl">{score} {level !== 5 && `/ ${(level === 3 || level === 4) ? 1 : WIN_SCORE}`}</span>
          </div>
        </div>
      </div>

      <div 
        ref={gameContainerRef}
        className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-8 border-slate-800 mx-auto w-full cursor-crosshair"
        style={{ maxWidth: GAME_WIDTH, aspectRatio: "1/1", maxHeight: '70vh' }}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onClick={handleClick}
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
          {TreeBg && (
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
          )}
          {!TreeBg && (
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900 overflow-hidden">
               {/* 3D Grid floor */}
               <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-fuchsia-600/30 to-transparent" style={{ transform: "perspective(500px) rotateX(60deg)", transformOrigin: "bottom" }}>
                  <div className="w-full h-full border-t border-fuchsia-500/30" style={{ backgroundImage: "linear-gradient(to right, rgba(217, 70, 239, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(217, 70, 239, 0.2) 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
               </div>
               {/* Distant glowing horizon */}
               <div className="absolute top-2/3 left-1/2 w-[200%] h-[100%] bg-pink-500/20 blur-[100px] -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
               <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
               {/* Glowing stars/particles */}
               <div className="absolute top-20 left-20 w-1 h-1 bg-white rounded-full animate-pulse shadow-[0_0_10px_#fff]"></div>
               <div className="absolute top-40 right-30 w-2 h-2 bg-blue-400 rounded-full animate-[pulse_2s_infinite] shadow-[0_0_15px_#60A5FA]"></div>
               <div className="absolute top-10 right-1/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-[pulse_3s_infinite] shadow-[0_0_12px_#F472B6]"></div>
            </div>
          )}

          {gameState === "playing" && (
            <>
              {/* Static Question Box */}
              {level >= 3 && currentQuestion && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40 w-full flex justify-center px-4 pointer-events-none">
                  <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 border-4 border-white rounded-2xl px-6 py-3 font-black text-2xl sm:text-3xl text-white shadow-[0_0_15px_rgba(236,72,153,0.5)] tracking-wide text-center max-w-[95%] whitespace-normal leading-tight">
                    {level === 4 && memoryPhase === "show" ? currentQuestion.sequence.join(" ➔ ") :
                     level === 4 && memoryPhase === "hide" ? "..." :
                     level === 4 && memoryPhase === "playing" ? currentQuestion.question :
                     (currentQuestion.prompt || 
                      (currentQuestion.target === "INDIA" ? "Find capital of INDIA" :
                       currentQuestion.target === "WATER" ? "Find formula for WATER" :
                       currentQuestion.target === "APPLE" ? "Find the word: APPLE" : 
                       currentQuestion.target))}
                  </div>
                </div>
              )}

              {/* Background Children removed as requested */}

              {/* Momo */}
              <div 
                className={`absolute ${level >= 3 ? 'top-24' : 'top-2'} transform -translate-x-1/2 transition-transform duration-75 z-20 flex flex-col items-center ${level === 5 ? 'scale-150 top-32' : ''}`}
                style={{ left: momoX }}
              >
                {level >= 3 ? (
                  <div className="relative mt-2 animate-pulse" style={{ transform: `translateY(${Math.sin(momoX / 30) * 10}px)` }}>
                    <div className="absolute -bottom-8 -left-10 z-0">
                      <FloatingMatSVG />
                    </div>
                    <div className="relative z-10">
                      {level === 3 ? (
                        <div className="w-[120px] h-[130px] rounded-[40px] overflow-hidden border-4 border-pink-400 shadow-[0_0_15px_#F472B6] bg-white">
                          <img src="/milky_attractive_rabbit.png" alt="Real Rabbit" className="w-full h-full object-cover" />
                        </div>
                      ) : level === 4 ? (
                        <ElephantSVG expression={momoExpression} />
                      ) : (
                        <MonkeySVG expression={momoExpression} isTeacher={true} />
                      )}
                    </div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4 z-20">
                      <BookSVG />
                    </div>
                  </div>
                ) : (
                  <MonkeySVG expression={momoExpression} isTeacher={false} />
                )}
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
              <BubbleShooterChildBackSVG isHit={isHit} direction={playerDirection} score={score} />
            )}
          </div>

              {/* Bubbles */}
              {bubbles.map(bubble => (
                <div key={bubble.id} className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none" style={{ left: bubble.x, top: bubble.y }}>
                  <BubbleSVG />
                </div>
              ))}

              {/* Falling Items */}
              {berries.map((berry) => (
                <div
                  key={berry.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                  style={{ left: berry.x, top: berry.y }}
                >
                  {level >= 3 ? (
                    berry.status === "transformed" ? (
                      berry.objectSvg === "apple" ? <AppleSVG /> :
                      berry.objectSvg === "water" ? <WaterSVG /> :
                      <FlagSVG />
                    ) : (
                      <div className={`px-5 py-3 rounded-2xl border-4 shadow-[0_0_15px_rgba(255,255,255,0.5)] font-black text-2xl ${berry.status === 'falling' ? colorThemes[berry.colorScheme || 0] : 'bg-red-500 border-red-700 text-white opacity-50 scale-125 transition-all duration-300'}`}>
                        {berry.text}
                      </div>
                    )
                  ) : (
                    <CurrentFruit />
                  )}
                </div>
              ))}

              {/* Main Player Front (For Basket) */}
              {(level === 2 || level >= 3) && (
                <div
                  className="absolute bottom-0 transform -translate-x-1/2 z-40 transition-transform duration-100 pointer-events-none"
                  style={{ left: playerX }}
                >
                   {level === 2 ? <BasketChildFrontSVG direction={playerDirection} /> : <BubbleShooterChildFrontSVG direction={playerDirection} />}
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
                  <div className={`${sceneEvent.isWrong ? "bg-red-500 text-white border-red-300" : "bg-green-400 text-green-950 border-green-200"} text-lg font-bold px-4 py-2 rounded-full border-4 whitespace-nowrap`}>
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
                  You completed the level in <b className="text-white">{finalTime} seconds</b>! 
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
                    ) : level === 2 ? (
                        <>
                          <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                            <BubbleSVG /> Level 3: Word Shooter
                          </h3>
                          <p className="text-sm text-slate-400">
                            Shoot bubbles at the correct falling words! They will magically transform so you can catch them!
                          </p>
                        </>
                    ) : level === 3 ? (
                        <>
                          <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                            <BubbleSVG /> Level 4: Memory Mode
                          </h3>
                          <p className="text-sm text-slate-400">
                            Memorize the sequence of words the monkey shows. Then answer the question!
                          </p>
                        </>
                    ) : (
                        <>
                          <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                            <BubbleSVG /> Level 5: Boss Battle
                          </h3>
                          <p className="text-sm text-slate-400">
                            Giant Monkey attack! Shoot all the FRUITS before the time runs out!
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
                  You outsmarted the animals across all levels in <b className="text-white">{finalTime} seconds</b>! You've beaten the game!
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