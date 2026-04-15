/*
create two HTML elements and add it to the body. One is a canvas, the second one is a div.
*/

import React from "react";
import { initiateBoard } from "./board";
import { bindBasicKeyboardControls } from "./controls";
import { createRoot } from "react-dom/client";
import { ResourcesStorage } from "./ui/ResourcesStorage";
import { GameTimer } from "./ui/GameTimer";
import { CashDisplay } from "./ui/CashDisplay";

export let gameCanvas: HTMLCanvasElement;
export let uiLayer: HTMLDivElement;

const initiateGameSetup = () => {
	gameCanvas = document.createElement("canvas");
	gameCanvas.className = "game-canvas";
	uiLayer = document.createElement("div");
	uiLayer.className = "game-ui-container";

	document.body.appendChild(gameCanvas);
	document.body.appendChild(uiLayer);

	initiateBoard();
	bindBasicKeyboardControls();

	renderUI();
};

function renderUI() {
	createRoot(uiLayer).render(
		<React.StrictMode>
			<div className="right-ui-container">
				<GameTimer />
				<ResourcesStorage />
				<CashDisplay />
			</div>
		</React.StrictMode>,
	);
}

export default initiateGameSetup;
