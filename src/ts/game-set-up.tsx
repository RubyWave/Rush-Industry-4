/*
create two HTML elements and add it to the body. One is a canvas, the second one is a div.
*/

import React from "react";
import { bindBoardClick, Board, initiateBoard } from "./board/the-board";
import { bindBasicKeyboardControls } from "./controls";
import { createRoot } from "react-dom/client";
import { ResourcesStorage } from "./ui/ResourcesStorage";
import { GameTimer } from "./ui/GameTimer";
import { CashDisplay } from "./ui/CashDisplay";
import { BuildingsBar } from "./ui/BuildingsBar";
import { GameLog } from "./ui/GameLog";
import { BuildingStats } from "./ui/BuldingStats";
import { GameInstructions } from "./ui/GameInstructions";

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

function renderUI() {
	createRoot(uiLayer).render(
		<React.StrictMode>
			<div className="left-ui-container">
				<GameLog />
			</div>
			<div className="center-top-ui-container">
				<BuildingStats />
			</div>
			<div className="right-ui-container">
				<GameTimer />
				<ResourcesStorage />
				<CashDisplay />
			</div>
			<div className="left-bottom-ui-container">
				<GameInstructions />
			</div>
			<div className="bottom-ui-container">
				<BuildingsBar />
			</div>
		</React.StrictMode>,
	);
}

export default initiateGameSetup;
