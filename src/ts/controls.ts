import { gameStates } from "./game-set-up";

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
		gameStates.runState = !gameStates.runState;
		console.log("runState:", gameStates.runState);
	};

	window.addEventListener("keydown", onKeyDown);
	return () => {
		window.removeEventListener("keydown", onKeyDown);
	};
}
