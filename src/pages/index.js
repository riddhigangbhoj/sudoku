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
  const [initialBoard, setInitialBoard] = useState([]);
  const [difficulty, setDifficulty] = useState(50);
  const [selectedCell, setSelectedCell] = useState(null);
  const [incorrectCells, setIncorrectCells] = useState(new Set());
  const [highlightedNumber, setHighlightedNumber] = useState(null);

  useEffect(() => {
    newGame();
  }, [difficulty]);

  const newGame = () => {
    const { board: newBoard, solution: newSolution } = generateSudoku(difficulty);
    setBoard(newBoard);
    setSolution(newSolution);
    setInitialBoard(newBoard.map(row => [...row]));
    setSelectedCell(null);
    setIncorrectCells(new Set());
    setHighlightedNumber(null);
  }

  const handleCellClick = (row, col) => {
    if (initialBoard[row][col] === 0) {
      setSelectedCell([row, col]);
    }
    setHighlightedNumber(board[row][col] !== 0 ? board[row][col] : null);
  }

  const handleNumberInput = (num) => {
    if (selectedCell) {
      const [row, col] = selectedCell;
      if (initialBoard[row][col] === 0) {
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
        setHighlightedNumber(num);
      }
    }
  }

  const handleErase = () => {
    if (selectedCell) {
      const [row, col] = selectedCell;
      if (initialBoard[row][col] === 0) {
        const newBoard = [...board];
        newBoard[row][col] = 0;
        setBoard(newBoard);

        const cellKey = `${row}-${col}`;
        const newIncorrectCells = new Set(incorrectCells);
        newIncorrectCells.delete(cellKey);
        setIncorrectCells(newIncorrectCells);
        setHighlightedNumber(null);
      }
    }
  }

  const getHint = () => {
    if (selectedCell) {
      const [row, col] = selectedCell;
      if (initialBoard[row][col] === 0) {
        const newBoard = [...board];
        newBoard[row][col] = solution[row][col];
        setBoard(newBoard);
        setHighlightedNumber(solution[row][col]);

        const cellKey = `${row}-${col}`;
        const newIncorrectCells = new Set(incorrectCells);
        newIncorrectCells.delete(cellKey);
        setIncorrectCells(newIncorrectCells);
      }
    }
  }

  const getCellBackgroundColor = (rowIndex, colIndex) => {
    const boxRow = Math.floor(rowIndex / 3);
    const boxCol = Math.floor(colIndex / 3);
    const isAlternateBox = (boxRow + boxCol) % 2 === 0;
    
    if (board[rowIndex][colIndex] === highlightedNumber) {
      return '#ffff99';  // Highlight color for matching numbers
    } else if (selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex) {
      return '#e0e0e0';  // Selected cell color
    } else if (isAlternateBox) {
      return '#e6f3ff';  // Light blue for alternate 3x3 boxes
    } else {
      return '#fff';  // White for other cells
    }
  }

  const getCellTextColor = (rowIndex, colIndex) => {
    if (initialBoard[rowIndex][colIndex] !== 0) {
      return 'black';  // Initial numbers are black
    } else if (incorrectCells.has(`${rowIndex}-${colIndex}`)) {
      return 'red';  // Incorrect numbers are red
    } else {
      return 'blue';  // User-entered correct numbers are blue
    }
  }

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '500px', 
      margin: '0 auto', 
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '30px'
    }}>
      <h1 style={{ 
        textAlign: 'center',
        fontSize: '2.5rem',
        color: '#333',
        marginBottom: '20px'
      }}>Sudoku Game</h1>
      
      <div style={{ 
        width: '100%',
        display: 'flex', 
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <select 
          value={difficulty} 
          onChange={(e) => setDifficulty(Number(e.target.value))}
          style={{ padding: '8px', fontSize: '1rem' }}
        >
          <option value={50}>Easy</option>
          <option value={35}>Medium</option>
          <option value={20}>Hard</option>
        </select>
        <button onClick={newGame} style={{ padding: '8px 15px', fontSize: '1rem' }}>New Game</button>
        <button onClick={getHint} style={{ padding: '8px 15px', fontSize: '1rem' }}>Get Hint</button>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(9, 1fr)', 
        gap: '1px', 
        backgroundColor: '#000', 
        padding: '1px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}>
        {board.map((row, rowIndex) => 
          row.map((cell, colIndex) => (
            <div 
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              style={{
                backgroundColor: getCellBackgroundColor(rowIndex, colIndex),
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '45px',
                width: '45px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                color: getCellTextColor(rowIndex, colIndex)
              }}
            >
              {cell !== 0 ? cell : ''}
            </div>
          ))
        )}
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(5, 1fr)', 
        gap: '10px',
        marginTop: '20px',
        width: '100%'
      }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button 
            key={num} 
            onClick={() => handleNumberInput(num)}
            style={{ 
              padding: '10px 15px', 
              fontSize: '1.1rem',
              borderRadius: '5px',
              border: '1px solid #ccc',
              background: '#f0f0f0',
              cursor: 'pointer'
            }}
          >
            {num}
          </button>
        ))}
        <button 
          onClick={handleErase}
          style={{ 
            padding: '10px 15px', 
            fontSize: '1.1rem',
            borderRadius: '5px',
            border: '1px solid #ccc',
            background: '#ff9999', // Light red background for the eraser
            cursor: 'pointer',
            gridColumn: 'span 2' // Make the eraser button span two columns
          }}
        >
          Erase
        </button>
      </div>
    </div>
  );
}
