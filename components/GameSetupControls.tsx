import { Button } from "./Button";

type Props = {
    gridSize: number;
    gameOver: boolean;
    gameStarted: boolean;
    onStartGame: () => void;
    onExitGame: () => void;
    handleSizeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    gridSizesOptions?: number[];
}

export const GameSetupControls = ({ gridSize, gameOver, gameStarted, gridSizesOptions, onStartGame, onExitGame, handleSizeChange }: Props) => {
    if (gameStarted || gameOver) return null;
    return (<div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-4">
        {!gameOver && (
            <div className="flex items-center gap-2">
                <label htmlFor="gridSizeSelect" className="text-lg text-gray-300">Grid Size:</label>
                <select
                    id="gridSizeSelect"
                    value={gridSize}
                    onChange={handleSizeChange}
                    disabled={gameStarted && !gameOver}
                    className="bg-gray-600 border border-gray-500 text-white text-lg rounded-md p-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none"
                    aria-label="Select grid size"
                >
                    {gridSizesOptions?.map(size => (
                        <option key={size} value={size}>{size}x{size}</option>
                    ))}
                </select>
            </div>
        )}
        <Button
            onClick={onStartGame}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 text-lg focus:ring-yellow-300 focus:ring-opacity-50"
        >
            {gameOver ? 'Play Again' : 'Start Game'}
        </Button>
        {gameOver && (
            <Button
                onClick={onExitGame}
                className="bg-red-600 hover:bg-red-700 text-white text-md focus:ring-red-500 focus:ring-opacity-50"
            >
                Exit Game
            </Button>
        )}
    </div>)
};