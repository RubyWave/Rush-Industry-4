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
			console.log("gameLoop tick, ticks:" + gameStatesGlobal.tickCounter);
			gameStatesGlobal.tickCounter++;
			emitChange();
		},
		() => gameStatesGlobal.runState,
	);
});
