import initiateGameSetup from "./game-set-up";
import { gameLoop } from "./game-loop";
import {
	emitChange,
	gameStatesGlobal,
} from "./game-information/gameStatesStore";

document.addEventListener("DOMContentLoaded", () => {
	initiateGameSetup();
	gameLoop(
		() => {
			gameStatesGlobal.tickCounter++;
			emitChange();
		},
		() => gameStatesGlobal.runState,
	);
});
