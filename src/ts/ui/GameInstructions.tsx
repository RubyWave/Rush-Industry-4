import { availableBuildings } from "../buildings.ts/aviable-buildings";
import { settings } from "../game-information/settings";

export const GameInstructions = () => {
	return (
		<div className="game-instructions">
			<p>
				The point of the game is to make as much money as possible in
				the given time ({settings.gameTime} seconds). First, you will
				have a map preview for {settings.mapPreviewTime} seconds. After
				that, the game starts, you can&apos;t stop it, and it will
				continue until the time is up.
			</p>
			<p>
				There are {Object.values(availableBuildings).length} buildings
				to choose from. You can select them by clicking, or by
				corresponding number on the keyboard. To build a building,
				select one, and click on empty hex on the board. Some buildings
				can be rotated before building them, do that by pressing R. Mind
				rotation can&apos;t be changed later. You can destroy buildings
				by placing Bulldozer on them, although you will get no refund.
			</p>
			<p>
				Some buildings have input resources. If there will be not enough
				of needed resources in the storage, the resource will be bought
				automatically at {settings.resourceBuyPriceModifier}x base
				price. It can be lowered by placing Market next to the building.
			</p>
			<p>
				The board consist of {settings.board.cols} columns and{" "}
				{settings.board.rows} rows. On some hexes, some resources are
				spawned. While it is not required to build mines on specific
				resource, doing so, increases the throughput of the building.
			</p>
			<p>
				Building can be queued to be built instead of building
				instantly. To do so, either press Shift to toggle blueprint
				mode, or try building when not enough cash is available.
				Building will be queued as a last in the queue. Every tick, the
				first building from the queue will be built, if enough cash is
				available.
			</p>
			<p>
				To earn money, you need to sell any resource using Market
				building. At the end of the game, all your resources will be
				sold automatically at half of the base price.
			</p>
		</div>
	);
};
