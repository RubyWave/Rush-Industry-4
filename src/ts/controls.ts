import {
	emitChange,
	gameStatesGlobal,
} from "./game-information/gameStatesStore";

/**
 * Space toggles play/pause. Prevents default so the page does not scroll.
 * Returns a function that removes the listener.
 */
export function bindBasicKeyboardControls(): () => void {
	const onKeyDown = (event: KeyboardEvent): void => {
		if (event.code !== "Space" || event.repeat) {
			return;
		}
		event.preventDefault();
		gameStatesGlobal.runState = !gameStatesGlobal.runState;
		gameStatesGlobal.gameLog = [
			...gameStatesGlobal.gameLog,
			{
				message: `Game ${gameStatesGlobal.runState ? "started" : "paused"}`,
				logType: "info",
			},
		];
		emitChange();
	};

	window.addEventListener("keydown", onKeyDown);
	return () => {
		window.removeEventListener("keydown", onKeyDown);
	};
}
