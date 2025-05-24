import { CellBaseStatus } from '../types';
import Cell from './Cell';

type Props = {
    gridSize: number;
    gameStarted: boolean;
    gameOver: boolean;
    knightPos: { row: number; col: number } | null;
    possibleMoves: { row: number; col: number }[];
    gridState: CellBaseStatus[][];
    setHoveredPossibleCell: React.Dispatch<React.SetStateAction<{ row: number; col: number } | null>>;
    hoveredPossibleCell: { row: number; col: number } | null;
    handleCellClick: (row: number, col: number) => void;
};

export const GameGrid = ({ gridSize, gridState, knightPos, gameStarted, gameOver, possibleMoves, hoveredPossibleCell, setHoveredPossibleCell, handleCellClick }: Props) => {
    if (gridState.length === 0) return null;
    return (
    <div
        className="grid gap-0 bg-gray-600 p-1 rounded-md shadow-inner w-full max-w-[calc(100vh-2rem)] mx-auto"
        style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
        aria-label={`Game grid ${gridSize} by ${gridSize}`}
        role="grid"
    >
        {gridState.map((rowArray, rowIndex) =>
            rowArray.map((cellStatus, colIndex) => {
                const currentCellPos = { row: rowIndex, col: colIndex };
                const isKnightHere = knightPos?.row === rowIndex && knightPos?.col === colIndex;

                const isPotentialTarget =
                    gameStarted &&
                    !gameOver &&
                    ((!knightPos && cellStatus === CellBaseStatus.EMPTY) ||
                        (knightPos &&
                            possibleMoves.some(p => p.row === currentCellPos.row && p.col === currentCellPos.col) &&
                            cellStatus === CellBaseStatus.EMPTY));

                const isHovered =
                    isPotentialTarget &&
                    hoveredPossibleCell?.row === rowIndex &&
                    hoveredPossibleCell?.col === colIndex;

                return (
                    <Cell
                        key={`${rowIndex}-${colIndex}`}
                        status={cellStatus}
                        isAtKnightPos={isKnightHere}
                        isHighlightedByMouse={Boolean(isHovered)}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        onMouseEnter={() => isPotentialTarget && setHoveredPossibleCell(currentCellPos)}
                        onMouseLeave={() => {
                            if (hoveredPossibleCell?.row === rowIndex && hoveredPossibleCell?.col === colIndex) {
                                setHoveredPossibleCell(null);
                            }
                        }}
                    />
                );
            })
        )}
    </div>
)};