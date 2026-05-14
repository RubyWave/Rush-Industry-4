import { preGameSetup } from "./game-set-up";
import { gameLoop } from "./game-loop";
import {
	emitChange,
	gameStatesGlobal,
} from "./game-information/gameStatesStore";

document.addEventListener("DOMContentLoaded", () => {
	preGameSetup();
	gameLoop(
		() => {
			gameStatesGlobal.tickCounter++;
			emitChange();
		},
		() => gameStatesGlobal.runState === "game-running",
	);
});
