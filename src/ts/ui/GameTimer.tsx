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
	const gameTimeLeft =
		settings.gameTime +
		settings.mapPreviewTime -
		Math.floor(gameTimer / settings.tickInterval);
	const mapPreviewTimeLeft =
		settings.mapPreviewTime - Math.floor(gameTimer / settings.tickInterval);
	let gameTimeLeftString = gameTimeLeft.toString();
	if (mapPreviewTimeLeft > 0) {
		gameTimeLeftString = settings.gameTime + " + " + mapPreviewTimeLeft;
	}
	if (gameTimeLeft <= 0) {
		gameTimeLeftString = "0";
	}

	return (
		<div className="game-timer">
			<h3>Seconds left: {gameTimeLeftString}</h3>
			<h3>Game state:{" " + gameStateString}</h3>
		</div>
	);
};
