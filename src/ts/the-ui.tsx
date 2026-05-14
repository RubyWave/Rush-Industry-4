import React, { useState, useSyncExternalStore } from "react";
import { createRoot } from "react-dom/client";
import { initiateGameSetup, uiLayer } from "./game-set-up";
import { BuildingsBar } from "./ui/BuildingsBar";
import { BuildingQueue } from "./ui/BuldingQueue";
import { BuildingStats } from "./ui/BuldingStats";
import { CashDisplay } from "./ui/CashDisplay";
import { GameInstructions } from "./ui/GameInstructions";
import { GameLog } from "./ui/GameLog";
import { GameTimer } from "./ui/GameTimer";
import { ResourcesStorage } from "./ui/ResourcesStorage";
import { KeyStatesDisplay } from "./ui/KeyStatesDisplay";
import {
	gameStatesGlobal,
	getSnapshot,
	subscribe,
} from "./game-information/gameStatesStore";

function RootUi() {
	const runState = useSyncExternalStore(
		subscribe,
		() => getSnapshot().runState,
	);
	const [setSeed, setSetSeed] = useState(gameStatesGlobal.randomSeed);

	return runState === "pregame" ? (
		<div className="pregame-ui">
			<div className="pregame-ui-content">
				<h1 className="pregame-ui-content__heading">Rush Industry 4</h1>
				<div className="pregame-ui-content__description">
					<GameInstructions />
				</div>
				<div className="pregame-ui-content__random-seed">
					<label htmlFor="random-seed">Random seed:</label>
					<input
						id="random-seed"
						type="text"
						value={setSeed}
						onChange={(e) => {
							setSetSeed(Number(e.target.value));
						}}
					/>
					<button
						onClick={() => {
							gameStatesGlobal.randomSeed = Number(setSeed);
							initiateGameSetup();
						}}
					>
						Start the game
					</button>
				</div>
			</div>
		</div>
	) : (
		<div className="game-ui">
			<div className="left-ui-container">
				<GameLog />
				<KeyStatesDisplay />
			</div>
			<div className="center-top-ui-container">
				<BuildingStats />
			</div>
			<div className="right-ui-container">
				<GameTimer />
				<ResourcesStorage />
				<CashDisplay />
			</div>
			<div className="left-bottom-ui-container"></div>
			<div className="bottom-ui-container">
				<BuildingsBar />
			</div>
			<div className="right-bottom-ui-container">
				<BuildingQueue />
			</div>
		</div>
	);
}

export function renderUI() {
	createRoot(uiLayer).render(
		<React.StrictMode>
			<RootUi />
		</React.StrictMode>,
	);
}
