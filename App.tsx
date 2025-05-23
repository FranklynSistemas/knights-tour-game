
import React, { useState, useEffect, useCallback } from 'react';
import { CellBaseStatus, Position } from './types';
import Cell from './components/Cell';

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
      } else if (newMoves.length === 0 && visitedCount < gridSize * gridSize && visitedCount > 0) { // Added visitedCount > 0 to ensure knight was placed
        setGameOver(true);
        setWinMessage(`No more moves possible. You visited ${visitedCount} out of ${gridSize * gridSize} squares.`);
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

        {/* Game Setup Controls: Visible before game starts or after game over */}
        {(!gameStarted || gameOver) && (
          <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="gridSizeSelect" className="text-lg text-gray-300">Grid Size:</label>
              <select
                id="gridSizeSelect"
                value={gridSize}
                onChange={handleSizeChange}
                disabled={gameStarted && !gameOver} // Disabled during an active game
                className="bg-gray-600 border border-gray-500 text-white text-lg rounded-md p-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none"
                aria-label="Select grid size"
              >
                {gridSizesOptions.map(size => (
                  <option key={size} value={size}>{size}x{size}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleStartGame}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-2 px-6 rounded-md text-lg transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50"
            >
              {gameOver ? 'Play Again' : 'Start Game'}
            </button>
          </div>
        )}
        
        {/* In-Game Information and Controls: Visible during an active game */}
        {gameStarted && !gameOver && (
           <div className="mb-6 flex flex-col items-center gap-4">
            <div className="text-center text-lg text-gray-300 mb-2" aria-live="assertive">
              Playing on a {gridSize}x{gridSize} Grid
            </div>
            <div className="text-center text-2xl font-mono text-yellow-400" aria-live="polite">
              Time: {formatTime(elapsedTime)} | Visited: {visitedCount}/{gridSize*gridSize}
            </div>
            <div className="flex gap-3"> {/* Container for Restart and Exit buttons */}
              <button
                onClick={handleStartGame} // Re-uses handleStartGame for restart functionality
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-md transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
              >
                Restart Game
              </button>
              <button
                onClick={handleExitGame}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md text-md transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Exit Game
              </button>
            </div>
           </div>
        )}

        {/* Grid Display */}
        {gridState.length > 0 && (
          <div 
            className="grid gap-0 bg-gray-600 p-1 rounded-md shadow-inner"
            style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
            aria-label={`Game grid ${gridSize} by ${gridSize}`}
            role="grid"
          >
            {gridState.map((rowArray, rowIndex) =>
              rowArray.map((cellStatus, colIndex) => {
                const currentCellPos = { row: rowIndex, col: colIndex };
                const isKnightHere = knightPos?.row === rowIndex && knightPos?.col === colIndex;
                
                // Determine if cell is a potential target for movement or initial placement
                const isPotentialTarget = gameStarted && !gameOver && (
                  (!knightPos && cellStatus === CellBaseStatus.EMPTY) || // For initial placement
                  (knightPos && possibleMoves.some(p => p.row === currentCellPos.row && p.col === currentCellPos.col) && cellStatus === CellBaseStatus.EMPTY) // For subsequent moves
                );
                
                const cellIsHighlightedByMouse = isPotentialTarget && hoveredPossibleCell?.row === rowIndex && hoveredPossibleCell?.col === colIndex;

                return (
                  <Cell
                    key={`${rowIndex}-${colIndex}`}
                    status={cellStatus}
                    isAtKnightPos={isKnightHere}
                    isHighlightedByMouse={cellIsHighlightedByMouse}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    onMouseEnter={() => {
                      if (isPotentialTarget) setHoveredPossibleCell(currentCellPos);
                    }}
                    onMouseLeave={() => {
                      // Only clear hover if this cell was the one being hovered
                      if (hoveredPossibleCell?.row === rowIndex && hoveredPossibleCell?.col === colIndex) {
                        setHoveredPossibleCell(null);
                      }
                    }}
                    gridSize={gridSize} // Pass gridSize to Cell
                  />
                );
              })
            )}
          </div>
        )}
        
        {/* Game Over Message */}
        {gameOver && winMessage && (
          <p className="mt-6 text-center text-xl text-yellow-400 bg-gray-600 p-4 rounded-md" role="alert">{winMessage}</p>
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
