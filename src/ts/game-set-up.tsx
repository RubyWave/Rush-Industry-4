/*
create two HTML elements and add it to the body. One is a canvas, the second one is a div.
*/

import { bindBoardClick, Board, initiateBoard } from "./board/the-board";
import { bindBasicKeyboardControls } from "./controls";
import { renderUI } from "./the-ui";
export let gameCanvas: HTMLCanvasElement;
export let uiLayer: HTMLDivElement;
export let board: Board;

const initiateGameSetup = () => {
	gameCanvas = document.createElement("canvas");
	gameCanvas.className = "game-canvas";
	uiLayer = document.createElement("div");
	uiLayer.className = "game-ui-container";

	document.body.appendChild(gameCanvas);
	document.body.appendChild(uiLayer);

	board = initiateBoard();
	bindBoardClick(board, gameCanvas);
	bindBasicKeyboardControls();

	renderUI();
};

export default initiateGameSetup;
