import { Button } from "./Button";

type Props = {
    gridSize: number;
    gameStarted: boolean;
    gameOver: boolean;
    elapsedTime: number;
    visitedCount: number;
    formatTime: (time: number) => string;
    handleStartGame: () => void;
    handleExitGame: () => void;
};

export const InGameControls = ({ gameStarted, gameOver, gridSize, elapsedTime, visitedCount, formatTime, handleExitGame, handleStartGame }: Props) => {
    if (!gameStarted && !gameOver) return null;
    return (
        <div className="mb-6 flex flex-col items-center gap-4">
            <div className="text-center text-lg text-gray-300 mb-2" aria-live="assertive">
                Playing on a {gridSize}x{gridSize} Grid
            </div>
            <div className="text-center text-2xl font-mono text-yellow-400" aria-live="polite">
                Time: {formatTime(elapsedTime)} | Visited: {visitedCount}/{gridSize * gridSize}
            </div>
            <div className="flex gap-3">
                <Button
                    onClick={handleStartGame}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-md focus:ring-blue-400 focus:ring-opacity-50"
                >
                    Restart Game
                </Button>
                <Button
                    onClick={handleExitGame}
                    className="bg-red-600 hover:bg-red-700 text-white text-md focus:ring-red-500 focus:ring-opacity-50"
                >
                    Exit Game
                </Button>
            </div>
        </div>
    )
};