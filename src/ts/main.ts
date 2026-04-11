import initiateGameSetup from "./game-set-up";
import { gameLoop } from "./game-loop";

document.addEventListener("DOMContentLoaded", () => {
	const { board, gameStates } = initiateGameSetup();
	gameLoop(
		() => {
			console.log("gameLoop tick, ticks:" + gameStates.tickCounter);
			gameStates.tickCounter++;
		},
		() => gameStates.runState,
	);
	console.log(board);
});
