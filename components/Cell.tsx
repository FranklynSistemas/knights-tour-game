
import React from 'react';
import { CellBaseStatus } from '../types';

interface CellProps {
  status: CellBaseStatus;
  isAtKnightPos: boolean;
  isHighlightedByMouse: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const Cell: React.FC<CellProps> = ({
  status,
  isAtKnightPos,
  isHighlightedByMouse,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
 

  let cellClasses = `aspect-square w-full border border-gray-300 flex items-center justify-center cursor-pointer transition-all duration-150 ease-in-out`;
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
        <span className={`text-xl leading-tight md:text-3xl md:leading-snug select-none ${knightColor}`}>♘</span>
      )}
    </div>
  );
};

export default Cell;
