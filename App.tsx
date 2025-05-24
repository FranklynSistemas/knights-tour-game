
import React, { useState, useEffect, useCallback } from 'react';

import { CellBaseStatus, Position } from './types';
import { GameSetupControls } from './components/GameSetupControls';
import { InGameControls } from './components/InGameControls';
import { GameGrid } from './components/GameGrid';
import { GameOverModal } from './components/GameOverMolda';

const MIN_GRID_SIZE = 3;
const MAX_GRID_SIZE = 10;

const App: React.FC = () => {
  const [gridSize, setGridSize] = useState<number>(5);
  const [gridState, setGridState] = useState<CellBaseStatus[][]>([]);
  const [knightPos, setKnightPos] = useState<Position | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Position[]>([]);
  const [hoveredPossibleCell, setHoveredPossibleCell] = useState<Position | null>(null);

  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [visitedCount, setVisitedCount] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [winMessage, setWinMessage] = useState<string>('');
  const [gameOverReason, setGameOverReason] = useState<'win' | 'fail'>('win');

  const initializeGrid = useCallback((size: number): CellBaseStatus[][] => {
    return Array(size).fill(null).map(() => Array(size).fill(CellBaseStatus.EMPTY));
  }, []);

  // Effect for initializing/resetting grid when size changes or game not started
  useEffect(() => {
    if (!gameStarted) {
      setGridState(initializeGrid(gridSize));
      setKnightPos(null);
      setVisitedCount(0);
      setPossibleMoves([]);
      setGameOver(false);
      setElapsedTime(0);
      setHoveredPossibleCell(null);
      setWinMessage('');
    }
  }, [gridSize, gameStarted, initializeGrid]);

  // Timer effect
  useEffect(() => {
    let intervalId: number | undefined;
    if (gameStarted && !gameOver) {
      intervalId = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000) as unknown as number; // Cast to number for browser environment
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [gameStarted, gameOver]);

  const getPossibleKnightMoves = useCallback((pos: Position, size: number, currentGrid: CellBaseStatus[][]): Position[] => {
    const moves: Position[] = [];
    const knightMoveOffsets = [
      { dr: -2, dc: -1 }, { dr: -2, dc: 1 }, { dr: -1, dc: -2 }, { dr: -1, dc: 2 },
      { dr: 1, dc: -2 }, { dr: 1, dc: 2 }, { dr: 2, dc: -1 }, { dr: 2, dc: 1 },
    ];

    for (const move of knightMoveOffsets) {
      const newRow = pos.row + move.dr;
      const newCol = pos.col + move.dc;
      if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size && currentGrid[newRow][newCol] === CellBaseStatus.EMPTY) {
        moves.push({ row: newRow, col: newCol });
      }
    }
    return moves;
  }, []);

  // Effect for updating possible moves and checking win condition
  useEffect(() => {
    if (gameOver || !gameStarted) {
      setPossibleMoves([]);
      return;
    }

    if (knightPos) {
      const newMoves = getPossibleKnightMoves(knightPos, gridSize, gridState);
      setPossibleMoves(newMoves);
      if (visitedCount > 0 && visitedCount === gridSize * gridSize) {
        setGameOver(true);
        setWinMessage(`Congratulations! You completed the tour in ${elapsedTime} seconds on a ${gridSize}x${gridSize} grid!`);
        setGameOverReason('win');
      } else if (newMoves.length === 0 && visitedCount < gridSize * gridSize && visitedCount > 0) { // Added visitedCount > 0 to ensure knight was placed
        setGameOver(true);
        setWinMessage(`No more moves possible. You visited ${visitedCount} out of ${gridSize * gridSize} squares.`);
        setGameOverReason('fail');
      }
    } else { // Knight not placed yet
      const initialPlacements: Position[] = [];
      gridState.forEach((rowArr, rIdx) => {
        rowArr.forEach((cellStatus, cIdx) => {
          if (cellStatus === CellBaseStatus.EMPTY) {
            initialPlacements.push({ row: rIdx, col: cIdx });
          }
        });
      });
      setPossibleMoves(initialPlacements);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [knightPos, gridState, gameStarted, gameOver, gridSize, visitedCount, elapsedTime, getPossibleKnightMoves]);


  const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGridSize(Number(event.target.value));
  };

  const handleStartGame = () => {
    setGameStarted(true);
    // Reset states that should be fresh for a new game (even if restarting)
    setGridState(initializeGrid(gridSize));
    setKnightPos(null);
    setVisitedCount(0);
    setGameOver(false);
    setElapsedTime(0);
    setHoveredPossibleCell(null);
    setWinMessage('');
    // Possible moves will be recalculated by the effect
  };

  const handleExitGame = () => {
    setGameStarted(false); // This will trigger the useEffect to reset the game state
  };

  const handleCellClick = (row: number, col: number) => {
    if (gameOver || !gameStarted) return;

    const newGrid = gridState.map(r => [...r]);

    if (!knightPos) { // First move: placing the knight
      if (newGrid[row][col] === CellBaseStatus.EMPTY) {
        newGrid[row][col] = CellBaseStatus.VISITED;
        setKnightPos({ row, col });
        setGridState(newGrid);
        setVisitedCount(1);
      }
    } else { // Subsequent moves
      const isMoveTarget = possibleMoves.some(move => move.row === row && move.col === col);
      if (isMoveTarget && newGrid[row][col] === CellBaseStatus.EMPTY) {
        newGrid[row][col] = CellBaseStatus.VISITED;
        setKnightPos({ row, col });
        setGridState(newGrid);
        setVisitedCount(prev => prev + 1);
      }
    }
    setHoveredPossibleCell(null); // Clear hover after click
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const gridSizesOptions = Array.from({ length: MAX_GRID_SIZE - MIN_GRID_SIZE + 1 }, (_, i) => MIN_GRID_SIZE + i);

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center justify-center p-4 selection:bg-yellow-400 selection:text-gray-800">
      <div className="bg-gray-700 p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-max">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-yellow-400 mb-6">Knight's Tour Game</h1>

        <GameSetupControls
          gridSize={gridSize}
          gameOver={gameOver}
          gameStarted={gameStarted}
          onStartGame={handleStartGame}
          onExitGame={handleExitGame}
          handleSizeChange={handleSizeChange}
          gridSizesOptions={gridSizesOptions}
        />
        <InGameControls
          gameStarted={gameStarted}
          gameOver={gameOver}
          gridSize={gridSize}
          elapsedTime={elapsedTime}
          visitedCount={visitedCount}
          formatTime={formatTime}
          handleStartGame={handleStartGame}
          handleExitGame={handleExitGame} />
        <GameGrid
          gridSize={gridSize}
          gridState={gridState}
          gameStarted={gameStarted}
          gameOver={gameOver}
          knightPos={knightPos}
          possibleMoves={possibleMoves}
          setHoveredPossibleCell={setHoveredPossibleCell}
          hoveredPossibleCell={hoveredPossibleCell}
          handleCellClick={handleCellClick}
        />

        {gameOver && winMessage && (
         <GameOverModal
            message={winMessage}
            type={gameOverReason}
            onClose={handleExitGame}
          />
        )}
      </div>

      <footer className="text-center text-gray-400 mt-8 text-sm">
        <p>A Knight's Tour Game. Try to visit every square on the board!</p>
        <p>&copy; {new Date().getFullYear()} AI Generated App</p>
      </footer>
    </div>
  );
};

export default App;
