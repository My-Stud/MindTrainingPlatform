"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Grid3x3, CheckCircle2 } from "lucide-react";

// --- Sudoku Generation Logic ---
const BLANK = 0;

function isValid(board, row, col, num) {
    for (let x = 0; x <= 8; x++) {
        if (board[row][x] === num) return false;
    }
    for (let x = 0; x <= 8; x++) {
        if (board[x][col] === num) return false;
    }
    let startRow = row - row % 3, startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i + startRow][j + startCol] === num) return false;
        }
    }
    return true;
}

function solveSudoku(board) {
    let row = -1;
    let col = -1;
    let isEmpty = true;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === BLANK) {
                row = i;
                col = j;
                isEmpty = false;
                break;
            }
        }
        if (!isEmpty) break;
    }
    if (isEmpty) return true;

    for (let num = 1; num <= 9; num++) {
        if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = BLANK;
        }
    }
    return false;
}

function fillDiagonal(board) {
    for (let i = 0; i < 9; i = i + 3) {
        fillBox(board, i, i);
    }
}

function fillBox(board, rowStart, colStart) {
    let num;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            do {
                num = Math.floor(Math.random() * 9) + 1;
            } while (!isSafeInBox(board, rowStart, colStart, num));
            board[rowStart + i][colStart + j] = num;
        }
    }
}

function isSafeInBox(board, rowStart, colStart, num) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[rowStart + i][colStart + j] === num) return false;
        }
    }
    return true;
}

function removeKDigits(board, K) {
    let count = K;
    while (count !== 0) {
        let cellId = Math.floor(Math.random() * 81);
        let i = Math.floor(cellId / 9);
        let j = cellId % 9;
        if (board[i][j] !== 0) {
            count--;
            board[i][j] = 0;
        }
    }
}

function generateSudoku(missingDigits = 40) {
    let board = Array.from({ length: 9 }, () => Array(9).fill(0));
    fillDiagonal(board);
    solveSudoku(board);
    
    // Deep copy solution
    let solution = JSON.parse(JSON.stringify(board));
    
    removeKDigits(board, missingDigits);
    return { puzzle: board, solution };
}

// --- Component ---
export default function SudokuGame() {
    const [puzzle, setPuzzle] = useState([]);
    const [grid, setGrid] = useState([]);
    const [solution, setSolution] = useState([]);
    const [selectedCell, setSelectedCell] = useState(null); // [row, col]
    const [isWon, setIsWon] = useState(false);
    const [errors, setErrors] = useState(0);

    const initGame = useCallback(() => {
        const { puzzle, solution } = generateSudoku(35); // 35 empty cells for easy/medium
        setPuzzle(JSON.parse(JSON.stringify(puzzle)));
        setGrid(JSON.parse(JSON.stringify(puzzle)));
        setSolution(solution);
        setSelectedCell(null);
        setIsWon(false);
        setErrors(0);
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const handleCellClick = (r, c) => {
        if (isWon) return;
        // Don't allow selecting original puzzle cells
        if (puzzle[r][c] !== 0) return;
        setSelectedCell([r, c]);
    };

    const handleNumberInput = useCallback((num) => {
        if (!selectedCell || isWon) return;
        const [r, c] = selectedCell;
        
        // If they click the same number, clear it
        if (grid[r][c] === num) {
             const newGrid = [...grid];
             newGrid[r] = [...grid[r]];
             newGrid[r][c] = 0;
             setGrid(newGrid);
             return;
        }

        const newGrid = [...grid];
        newGrid[r] = [...grid[r]];
        newGrid[r][c] = num;
        setGrid(newGrid);

        // Check for error immediately against solution (optional, but good for learning)
        if (num !== 0 && solution[r][c] !== num) {
            setErrors(e => e + 1);
        }

        // Check win condition
        let complete = true;
        let correct = true;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (newGrid[i][j] === 0) complete = false;
                if (newGrid[i][j] !== solution[i][j]) correct = false;
            }
        }
        if (complete && correct) {
            setIsWon(true);
        }
    }, [grid, selectedCell, isWon, solution]);

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key >= '1' && e.key <= '9') {
                handleNumberInput(parseInt(e.key));
            } else if (e.key === 'Backspace' || e.key === 'Delete') {
                handleNumberInput(0);
            } else if (e.key.startsWith('Arrow') && selectedCell) {
                let [r, c] = selectedCell;
                if (e.key === 'ArrowUp') r = Math.max(0, r - 1);
                if (e.key === 'ArrowDown') r = Math.min(8, r + 1);
                if (e.key === 'ArrowLeft') c = Math.max(0, c - 1);
                if (e.key === 'ArrowRight') c = Math.min(8, c + 1);
                // Try to find nearest non-fixed cell
                if (puzzle[r][c] === 0) {
                    setSelectedCell([r, c]);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNumberInput, selectedCell, puzzle]);

    if (grid.length === 0) return null;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-8 font-sans flex flex-col items-center">
            <div className="w-full max-w-2xl mb-6 flex items-center justify-between">
                <Link href="/games" className="inline-flex items-center text-slate-500 hover:text-indigo-600 font-medium transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Games
                </Link>
                <div className="flex gap-3 items-center">
                    <Grid3x3 className="w-8 h-8 text-indigo-500" />
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Sudoku</h1>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center w-full max-w-md">
                <div className="flex justify-between w-full mb-4 px-2">
                    <div className="text-lg font-bold text-slate-600">
                        Errors: <span className={errors > 0 ? "text-red-500" : "text-emerald-500"}>{errors}</span>
                    </div>
                    <button onClick={initGame} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-bold transition-colors">
                        <RefreshCw className="w-5 h-5" /> New Game
                    </button>
                </div>

                <div className="bg-white p-2 sm:p-4 rounded-2xl shadow-xl border border-slate-200">
                    <div className="grid grid-cols-9 gap-0 border-2 border-slate-800 bg-slate-800 w-full aspect-square">
                        {grid.map((row, r) => 
                            row.map((cell, c) => {
                                const isFixed = puzzle[r][c] !== 0;
                                const isSelected = selectedCell && selectedCell[0] === r && selectedCell[1] === c;
                                const isError = !isFixed && cell !== 0 && cell !== solution[r][c];
                                const isHighlighted = selectedCell && (selectedCell[0] === r || selectedCell[1] === c || (Math.floor(selectedCell[0]/3) === Math.floor(r/3) && Math.floor(selectedCell[1]/3) === Math.floor(c/3)));
                                const isSameNumber = cell !== 0 && selectedCell && grid[selectedCell[0]][selectedCell[1]] === cell;
                                
                                let bgClass = "bg-white";
                                if (isSelected) bgClass = "bg-indigo-200";
                                else if (isSameNumber) bgClass = "bg-indigo-100";
                                else if (isHighlighted) bgClass = "bg-indigo-50";

                                return (
                                    <div 
                                        key={`${r}-${c}`}
                                        onClick={() => handleCellClick(r, c)}
                                        className={`
                                            flex items-center justify-center text-xl sm:text-2xl font-bold cursor-pointer transition-colors
                                            ${bgClass}
                                            ${isFixed ? 'text-slate-800' : (isError ? 'text-red-500' : 'text-indigo-600')}
                                            ${(c + 1) % 3 === 0 && c !== 8 ? 'border-r-2 border-r-slate-800' : 'border-r border-r-slate-300'}
                                            ${(r + 1) % 3 === 0 && r !== 8 ? 'border-b-2 border-b-slate-800' : 'border-b border-b-slate-300'}
                                            ${c === 0 ? 'border-l border-l-slate-300' : ''}
                                            ${r === 0 ? 'border-t border-t-slate-300' : ''}
                                            select-none
                                        `}
                                    >
                                        {cell !== 0 ? cell : ''}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Number Pad for Mobile / Mouse users */}
                <div className="grid grid-cols-5 gap-2 sm:gap-4 mt-8 w-full">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <button
                            key={num}
                            onClick={() => handleNumberInput(num)}
                            className="bg-white border-2 border-indigo-100 text-indigo-700 text-2xl font-black py-3 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 active:bg-indigo-200 transition-all shadow-sm"
                        >
                            {num}
                        </button>
                    ))}
                    <button
                        onClick={() => handleNumberInput(0)}
                        className="bg-slate-100 border-2 border-slate-200 text-slate-600 text-lg font-bold py-3 rounded-xl hover:bg-slate-200 active:bg-slate-300 transition-all shadow-sm flex items-center justify-center"
                    >
                        CLR
                    </button>
                </div>

                {isWon && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in">
                        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-sm w-full mx-4 border border-slate-100">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 mb-2">Solved!</h2>
                            <p className="text-slate-500 mb-8 font-medium">
                                Great job! You completed the puzzle with {errors} {errors === 1 ? 'error' : 'errors'}.
                            </p>
                            <button 
                                onClick={initGame}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-indigo-200"
                            >
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