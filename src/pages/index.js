'use client'

import React, { useState, useEffect } from 'react';

// Improved Sudoku generator function
const generateSudoku = (difficulty) => {
  const board = Array(9).fill(null).map(() => Array(9).fill(0));
  const solution = Array(9).fill(null).map(() => Array(9).fill(0));

  // Helper function to check if a number is valid in a given position
  const isValid = (num, row, col) => {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num || board[i][col] === num) return false;
    }
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxRow + i][boxCol + j] === num) return false;
      }
    }
    return true;
  }

  // Recursive function to fill the board
  const fillBoard = (row, col) => {
    if (col === 9) {
      row++;
      col = 0;
    }
    if (row === 9) return true;

    if (board[row][col] !== 0) return fillBoard(row, col + 1);

    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 0; i < 9; i++) {
      const index = Math.floor(Math.random() * nums.length);
      const num = nums[index];
      nums.splice(index, 1);
      if (isValid(num, row, col)) {
        board[row][col] = num;
        solution[row][col] = num;
        if (fillBoard(row, col + 1)) return true;
        board[row][col] = 0;
        solution[row][col] = 0;
      }
    }
    return false;
  }

  fillBoard(0, 0);

  // Remove numbers based on difficulty
  const cellsToRemove = 81 - difficulty;
  for (let i = 0; i < cellsToRemove; i++) {
    let row, col;
    do {
      row = Math.floor(Math.random() * 9);
      col = Math.floor(Math.random() * 9);
    } while (board[row][col] === 0);
    board[row][col] = 0;
  }

  return { board, solution };
}

export default function SudokuGame() {
  const [board, setBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [difficulty, setDifficulty] = useState(20);
  const [selectedCell, setSelectedCell] = useState(null);
  const [incorrectCells, setIncorrectCells] = useState(new Set());

  useEffect(() => {
    newGame();
  }, [difficulty]);

  const newGame = () => {
    const { board: newBoard, solution: newSolution } = generateSudoku(difficulty);
    setBoard(newBoard);
    setSolution(newSolution);
    setSelectedCell(null);
    setIncorrectCells(new Set());
  }

  const handleCellClick = (row, col) => {
    setSelectedCell([row, col]);
  }

  const handleNumberInput = (num) => {
    if (selectedCell) {
      const [row, col] = selectedCell;
      const newBoard = [...board];
      newBoard[row][col] = num;
      setBoard(newBoard);

      const cellKey = `${row}-${col}`;
      const newIncorrectCells = new Set(incorrectCells);
      if (num !== solution[row][col]) {
        newIncorrectCells.add(cellKey);
      } else {
        newIncorrectCells.delete(cellKey);
      }
      setIncorrectCells(newIncorrectCells);
    }
  }

  const getHint = () => {
    if (selectedCell) {
      const [row, col] = selectedCell;
      const newBoard = [...board];
      newBoard[row][col] = solution[row][col];
      setBoard(newBoard);
      const newIncorrectCells = new Set(incorrectCells);
      newIncorrectCells.delete(`${row}-${col}`);
      setIncorrectCells(newIncorrectCells);
    }
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Sudoku Game</h1>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <select 
          value={difficulty} 
          onChange={(e) => setDifficulty(Number(e.target.value))}
          style={{ padding: '5px' }}
        >
          <option value={20}>Easy</option>
          <option value={35}>Medium</option>
          <option value={50}>Hard</option>
        </select>
        <button onClick={newGame} style={{ padding: '5px 10px' }}>New Game</button>
        <button onClick={getHint} style={{ padding: '5px 10px' }}>Get Hint</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: '1px', backgroundColor: '#000', padding: '1px' }}>
        {board.map((row, rowIndex) => 
          row.map((cell, colIndex) => (
            <div 
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              style={{
                backgroundColor: selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex ? '#e0e0e0' : '#fff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '40px',
                cursor: 'pointer',
                fontWeight: 'bold',
                color: incorrectCells.has(`${rowIndex}-${colIndex}`) ? 'red' : 'black'
              }}
            >
              {cell !== 0 ? cell : ''}
            </div>
          ))
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button 
            key={num} 
            onClick={() => handleNumberInput(num)}
            style={{ margin: '0 5px', padding: '5px 10px' }}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}
