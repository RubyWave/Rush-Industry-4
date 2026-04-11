/**
 * Central snapshot of runtime simulation state. Extend this as the game grows.
 */
export interface GameStates {
	/** Ticks elapsed since the game started. */
	tickCounter: number;
	/** True if game Ticks are running */
	runState: boolean;
}

export function createGameStates(): GameStates {
	return {
		tickCounter: 0,
		runState: false,
	};
}
