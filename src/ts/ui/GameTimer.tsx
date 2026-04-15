import { useSyncExternalStore } from "react";
import { getSnapshot, subscribe } from "../game-information/gameStatesStore";

export const GameTimer = () => {
	const gameRunning = useSyncExternalStore(
		subscribe,
		() => getSnapshot().runState,
	);
	const gameTimer = useSyncExternalStore(
		subscribe,
		() => getSnapshot().tickCounter,
	);

	return (
		<div className="game-timer">
			<h3>Ticks ticked: {gameTimer}</h3>
			<h3>Game running: {gameRunning ? "Yes" : "No"}</h3>
		</div>
	);
};
