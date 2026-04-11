/** Target interval between ticks (~60 Hz). */
const TICK_MS = 1000 / 5;

export type GameLoopTick = (deltaMs: number) => void;

export type GameLoopShouldRun = () => boolean;

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
		onTick(TICK_MS);
	}, TICK_MS);

	console.log("gameLoop started");

	return () => {
		window.clearInterval(id);
	};
}
