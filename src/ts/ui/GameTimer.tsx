import { useSyncExternalStore } from "react";
import { getSnapshot, subscribe } from "../game-information/gameStatesStore";
import { settings } from "../game-information/settings";

export const GameTimer = () => {
	const gameRunning = useSyncExternalStore(
		subscribe,
		() => getSnapshot().runState,
	);
	const gameTimer = useSyncExternalStore(
		subscribe,
		() => getSnapshot().tickCounter,
	);
	let gameStateString = "";
	switch (gameRunning) {
		case "pregame":
			gameStateString = "Pre-game";
			break;
		case "map-viewing":
			gameStateString = "Map viewing";
			break;
		case "game-running":
			gameStateString = "Game running";
			break;
		case "post-game":
			gameStateString = "Post-game";
			break;
	}

	return (
		<div className="game-timer">
			<h3>
				Seconds left:{" "}
				{settings.gameTime -
					Math.floor(gameTimer / settings.tickInterval)}
			</h3>
			<h3>Game state:{" " + gameStateString}</h3>
		</div>
	);
};
