import { useState } from "react";
import { GameInstructions } from "./GameInstructions";
import { gameStatesGlobal } from "../game-information/gameStatesStore";
import { initiateGameSetup } from "../game-set-up";

export const PreGameView = () => {
	const [setSeed, setSetSeed] = useState(gameStatesGlobal.randomSeed);
	return (
		<div className="pregame-ui-content">
			<h1 className="pregame-ui-content__heading">Rush Industry 4</h1>
			<div className="pregame-ui-content__description">
				<GameInstructions />
			</div>
			<div className="pregame-ui-content__random-seed">
				<label htmlFor="random-seed">Random seed:</label>
				<input
					id="random-seed"
					type="text"
					value={setSeed}
					onChange={(e) => {
						setSetSeed(e.target.value);
					}}
				/>
				<button
					onClick={() => {
						gameStatesGlobal.randomSeed = setSeed;
						initiateGameSetup();
					}}
				>
					Start the game (Space)
				</button>
			</div>
		</div>
	);
};
