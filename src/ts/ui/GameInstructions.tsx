import { availableBuildings } from "../buildings.ts/aviable-buildings";
import { settings } from "../game-information/settings";

export const GameInstructions = () => {
	return (
		<div className="game-instructions">
			<h1>Rush Industry 4</h1>
			<p>
				The point of the game is to make as much money as possible in
				the given time ({settings.gameTime} seconds). When the game
				starts (by pressing the spacebar), you can&apos;t stop it, and
				it will continue until the time is up.
			</p>
			<p>
				There are {Object.values(availableBuildings).length} buildings
				to choose from. You can select them by clicking, or by
				corresponding number on the keyboard. To build a building,
				select one, and click on empty hex on the board. When building
				is built, you can not change it, sell it, or demolish it. Some
				buildings can be rotated before building them, do that by
				pressing R. Mind rotation can&apos;t be changed later.
			</p>
			<p>
				The board consist of {settings.board.cols} columns and{" "}
				{settings.board.rows} rows. On some hexes, some resources are
				spawned. While it is not required to build mines on specific
				resource, doing so, increases the throughput of the building.
			</p>
			<p>
				To earn money, you need to sell any resource using Market
				building. At the end of the game, all your resources will be
				sold automatically at half of the base price.
			</p>
		</div>
	);
};
