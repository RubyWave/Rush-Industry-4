/*
create two HTML elements and add it to the body. One is a canvas, the second one is a div.
*/

import { bindBoardClick, Board, initiateBoard } from "./board/the-board";
import { bindBasicKeyboardControls } from "./controls";
import {
	emitChange,
	gameStatesGlobal,
} from "./game-information/gameStatesStore";
import { settings } from "./game-information/settings";
import { renderUI } from "./the-ui";
export let gameCanvas: HTMLCanvasElement;
export let uiLayer: HTMLDivElement;
export let board: Board;

export const preGameSetup = () => {
	gameCanvas = document.createElement("canvas");
	gameCanvas.className = "game-canvas";
	uiLayer = document.createElement("div");
	uiLayer.className = "the-ui-container";
	document.body.appendChild(gameCanvas);
	document.body.appendChild(uiLayer);

	bindBasicKeyboardControls();
	renderUI();
	if (settings.skipPreGame) {
		initiateGameSetup();
	}
};

export const initiateGameSetup = () => {
	board = initiateBoard();
	bindBoardClick(board, gameCanvas);
	gameStatesGlobal.runState = "map-viewing";
	gameStatesGlobal.gameLog = [
		...gameStatesGlobal.gameLog,
		{
			message: `Creating the game with seed ${gameStatesGlobal.randomSeed}`,
			logType: "info",
		},
	];
	emitChange();
};
