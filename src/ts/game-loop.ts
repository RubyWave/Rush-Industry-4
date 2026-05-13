import { buildFromQueue } from "./board/build-building";
import {
	emitChange,
	gameStatesGlobal,
} from "./game-information/gameStatesStore";
import { settings } from "./game-information/settings";
import { calculateResourceProduction } from "./tick-actions/resource-calculations";

/** Target interval between ticks (~60 Hz). */
const TICK_MS = 1000 / settings.tickInterval;

export type GameLoopTick = (deltaMs: number) => void;

export type GameLoopShouldRun = () => boolean;

function gameOver() {
	let leftoversSellCash = 0;
	gameStatesGlobal.resourcesStorage.resources.forEach((resource) => {
		leftoversSellCash +=
			resource.amount * resource.resource.basePrice * 0.5; // sold at the half of the base price, promote active selling
		resource.amount = 0;
	});
	leftoversSellCash = Number(leftoversSellCash.toFixed(2));
	gameStatesGlobal.gameLog = [
		...gameStatesGlobal.gameLog,
		{
			message: "Sold leftovers for: " + leftoversSellCash + "€",
			logType: "info",
		},
	];
	gameStatesGlobal.cash += leftoversSellCash;
	gameStatesGlobal.runState = false;
	gameStatesGlobal.gameLog = [
		...gameStatesGlobal.gameLog,
		{
			message:
				"Game over! Your final score is: " +
				gameStatesGlobal.cash +
				"€",
			logType: "success",
		},
	];
}

/**
 * Runs `onTick` at the configured tick rate until the returned stop function is called.
 * When `shouldRun` is provided and returns false, ticks are skipped (pause) without stopping the interval.
 * Uses `setInterval` so the timer keeps firing while the tab is in the background (the browser may still throttle it).
 */
export function gameLoop(
	onTick: GameLoopTick,
	shouldRun: GameLoopShouldRun = () => true,
): () => void {
	const id = window.setInterval(() => {
		if (!shouldRun()) {
			return;
		}
		calculateResourceProduction();
		buildFromQueue();
		if (
			gameStatesGlobal.tickCounter >=
			settings.gameTime * settings.tickInterval
		) {
			gameOver();
		}

		emitChange();
		onTick(TICK_MS);
	}, TICK_MS);

	return () => {
		window.clearInterval(id);
	};
}
