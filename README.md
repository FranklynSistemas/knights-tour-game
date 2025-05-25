# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Prompt

Create an interactive HTML game using JavaScript with the following features:

Game Layout:
	•	A square table (grid) where the number of rows and columns is determined by the user via a <select> input. The user can choose any size between 3x3 and 10x10.
	•	All cells in the grid are white by default.
	•	A “Start Game” button appears below the table.

Game Mechanics:

When the “Start Game” button is clicked:
	1.	A timer appears at the top and begins counting the elapsed time in seconds.
	2.	The grid becomes interactive:
	•	The user controls a knight figure that follows the mouse pointer and can be placed on any white cell.
	•	Once placed, the cell turns red, representing the knight’s current position.
	•	The user can then move the knight to another cell only if it is a valid knight move (as in chess) from the current red square.
	•	Each new valid move turns the destination square red.
	•	The game ends when all squares in the grid are red, indicating that every cell has been visited via valid knight moves.

Requirements:
	•	Use HTML, CSS, and vanilla JavaScript.
	•	Ensure the knight movement rules are enforced (i.e., L-shaped moves: two squares in one direction and one square perpendicular).
	•	Provide visual feedback for allowed moves (e.g., highlight possible target squares when hovering).
	•	Optional: Disable or hide inputs after the game starts to prevent resizing mid-game.

   Possible improvements for this initial prompt: 

   - Specify better which framework to use, on this case the AI chose react
   - Ask for good code practices like single responsibility