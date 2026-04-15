import { gameStatesGlobal } from "./game-information/gameStatesStore";

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
		console.log("runState:", gameStatesGlobal.runState);
	};

	window.addEventListener("keydown", onKeyDown);
	return () => {
		window.removeEventListener("keydown", onKeyDown);
	};
}
