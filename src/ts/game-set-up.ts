/*
create two HTML elements and add it to the body. One is a canvas, the second one is a div.
*/

import { Board, initiateTable } from "./board";
import { bindBasicKeyboardControls } from "./controls";
import { createGameStates, GameStates } from "./game-state";

export const gameCanvas: HTMLCanvasElement = document.createElement("canvas");
export const gameUIContainer: HTMLDivElement = document.createElement("div");

const initiateGameSetup = (): { board: Board; gameStates: GameStates } => {
	gameCanvas.className = "game-canvas";
	gameUIContainer.className = "game-ui-container";
	document.body.appendChild(gameCanvas);
	document.body.appendChild(gameUIContainer);
	const board = initiateTable(gameCanvas);
	const gameStates = createGameStates();
	bindBasicKeyboardControls(gameStates);
	return { board, gameStates };
};

export default initiateGameSetup;
