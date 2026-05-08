import { redrawBoard } from "./board/the-board";
import { availableBuildings } from "./game-information/buildings";
import {
	emitChange,
	gameStatesGlobal,
} from "./game-information/gameStatesStore";

function digitFromKeyboardCode(code: string): number | null {
	if (code.startsWith("Digit")) {
		const n = Number(code.slice(5));
		return n >= 0 && n <= 9 ? n : null;
	}
	if (code.startsWith("Numpad")) {
		const rest = code.slice(6);
		const n = Number(rest);
		return rest !== "" && n >= 0 && n <= 9 ? n : null;
	}
	return null;
}

/**
 * Space toggles play/pause. Prevents default so the page does not scroll.
 * Returns a function that removes the listener.
 */
export function bindBasicKeyboardControls(): () => void {
	const onKeyDown = (event: KeyboardEvent): void => {
		event.preventDefault();
		switch (event.code) {
			case "Space":
				gameStatesGlobal.runState = !gameStatesGlobal.runState;
				gameStatesGlobal.gameLog = [
					...gameStatesGlobal.gameLog,
					{
						message: `Game ${gameStatesGlobal.runState ? "started" : "paused"}`,
						logType: "info",
					},
				];

				break;
			case "KeyR":
				if (gameStatesGlobal.pointingDirection === "upLeft") {
					gameStatesGlobal.pointingDirection = "upRight";
				} else if (gameStatesGlobal.pointingDirection === "upRight") {
					gameStatesGlobal.pointingDirection = "right";
				} else if (gameStatesGlobal.pointingDirection === "right") {
					gameStatesGlobal.pointingDirection = "downRight";
				} else if (gameStatesGlobal.pointingDirection === "downRight") {
					gameStatesGlobal.pointingDirection = "downLeft";
				} else if (gameStatesGlobal.pointingDirection === "downLeft") {
					gameStatesGlobal.pointingDirection = "left";
				} else if (gameStatesGlobal.pointingDirection === "left") {
					gameStatesGlobal.pointingDirection = "upLeft";
				}
				redrawBoard();
				break;
			case "Digit0":
			case "Digit1":
			case "Digit2":
			case "Digit3":
			case "Digit4":
			case "Digit5":
			case "Digit6":
			case "Digit7":
			case "Digit8":
			case "Digit9":
			case "Numpad0":
			case "Numpad1":
			case "Numpad2":
			case "Numpad3":
			case "Numpad4":
			case "Numpad5":
			case "Numpad6":
			case "Numpad7":
			case "Numpad8":
			case "Numpad9": {
				const digit = digitFromKeyboardCode(event.code);
				if (digit === null) {
					break;
				}
				const buildings = Object.values(availableBuildings);
				if (digit === 0) {
					gameStatesGlobal.selectedBuilding = null;
					break;
				}
				if (digit >= 1 && digit <= buildings.length) {
					const choice = buildings[digit - 1]!;
					gameStatesGlobal.selectedBuilding =
						gameStatesGlobal.selectedBuilding === choice.name
							? null
							: choice.name;
				}
				break;
			}
			default:
				break;
		}
		emitChange();
	};

	window.addEventListener("keydown", onKeyDown);
	return () => {
		window.removeEventListener("keydown", onKeyDown);
	};
}
