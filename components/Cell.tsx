
import React from 'react';
import { CellBaseStatus } from '../types';

interface CellProps {
  status: CellBaseStatus;
  isAtKnightPos: boolean;
  isHighlightedByMouse: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  gridSize: number; // Added gridSize to determine cell dimensions
}

const Cell: React.FC<CellProps> = ({
  status,
  isAtKnightPos,
  isHighlightedByMouse,
  onClick,
  onMouseEnter,
  onMouseLeave,
  gridSize,
}) => {
  let sizeClasses: string;

  if (gridSize < 6) {
    // For smaller grids (3x3, 4x4, 5x5), use smaller cells
    sizeClasses = "w-10 h-10 md:w-12 md:h-12"; // 40px base, 48px on md+
  } else {
    // For larger grids (6x6 to 10x10), use slightly larger cells
    sizeClasses = "w-12 h-12 md:w-14 md:h-14"; // 48px base, 56px on md+
  }

  let cellClasses = `${sizeClasses} border border-gray-300 flex items-center justify-center cursor-pointer transition-all duration-150 ease-in-out`;
  let knightColor = "text-gray-700"; // Default for highlighted empty cell

  if (isAtKnightPos || status === CellBaseStatus.VISITED) {
    cellClasses += " bg-red-500";
    knightColor = "text-white"; // Knight on a red square
  } else if (isHighlightedByMouse) {
    cellClasses += " bg-yellow-300"; // Highlight for potential move/placement on an empty cell
  } else {
    cellClasses += " bg-white hover:bg-gray-50"; // Empty and not highlighted
  }

  const showKnightFigure = isAtKnightPos || (isHighlightedByMouse && status === CellBaseStatus.EMPTY) ;

  return (
    <div
      className={cellClasses}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={`Cell ${status === CellBaseStatus.VISITED ? 'visited' : 'empty'}`}
    >
      {showKnightFigure && (
        <span className={`text-2xl md:text-3xl select-none ${knightColor}`}>♘</span>
      )}
    </div>
  );
};

export default Cell;
