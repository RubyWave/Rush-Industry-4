/*
create two HTML elements and add it to the body. One is a canvas, the second one is a div.
*/

import { Board, initiateBoard } from "./board";
import { bindBasicKeyboardControls } from "./controls";
import { createGameStates, GameStates } from "./game-information/game-states";
import { initResourcesStorageUI } from "./ui/resources-storage";

export let gameCanvas: HTMLCanvasElement;
export let uiLayer: HTMLDivElement;
export let gameStates: GameStates;

const initiateGameSetup = (): { board: Board; gameStates: GameStates } => {
	gameCanvas = document.createElement("canvas");
	gameCanvas.className = "game-canvas";
	uiLayer = document.createElement("div");
	uiLayer.className = "game-ui-container";

	document.body.appendChild(gameCanvas);
	document.body.appendChild(uiLayer);

	gameStates = createGameStates();
	const board = initiateBoard();
	bindBasicKeyboardControls();
	initResourcesStorageUI(gameStates.resourcesStorage);
	return { board, gameStates };
};

export default initiateGameSetup;
