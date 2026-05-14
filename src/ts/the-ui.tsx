import React, { useSyncExternalStore } from "react";
import { createRoot } from "react-dom/client";
import { uiLayer } from "./game-set-up";
import { BuildingsBar } from "./ui/BuildingsBar";
import { BuildingQueue } from "./ui/BuldingQueue";
import { BuildingStats } from "./ui/BuldingStats";
import { CashDisplay } from "./ui/CashDisplay";
import { GameLog } from "./ui/GameLog";
import { GameTimer } from "./ui/GameTimer";
import { ResourcesStorage } from "./ui/ResourcesStorage";
import { KeyStatesDisplay } from "./ui/KeyStatesDisplay";
import { getSnapshot, subscribe } from "./game-information/gameStatesStore";
import { PreGameView } from "./ui/PreGameView";

function RootUi() {
	const runState = useSyncExternalStore(
		subscribe,
		() => getSnapshot().runState,
	);

	return runState === "pregame" ? (
		<div className="pregame-ui">
			<PreGameView />
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
