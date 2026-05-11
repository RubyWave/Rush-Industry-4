import {
	emitChange,
	gameStatesGlobal,
} from "../game-information/gameStatesStore";
import { CellIndex, getCell } from "./the-board";
import { board } from "../game-set-up";
import { availableBuildings } from "../buildings.ts/aviable-buildings";
import { Building } from "../buildings.ts/buildings";

export function buildBuilding(index: CellIndex) {
	const building = Object.values(availableBuildings).find(
		(b) => b.name === gameStatesGlobal.selectedBuilding,
	);
	if (!building) return;
	const cell = getCell(board, index);
	if (!cell) return;
	if (cell.building) return;

	if (gameStatesGlobal.cash < building.baseCost) {
		gameStatesGlobal.gameLog = [
			...gameStatesGlobal.gameLog,
			{
				message: `Not enough cash to build ${building.namePretty}`,
				logType: "error",
			},
		];
		emitChange();
		return;
	}
	gameStatesGlobal.cash -= building.baseCost;

	if (
		building.buildingResourceMine &&
		cell.resourceOre?.name === building.buildingResourceMine.name
	) {
		building.throughputModifiers = [
			{
				modifier: 1.25,
				type: "multiplicative",
			},
		];
	}

	const newBuilding: Building = {
		...building,
		pointingDirection: gameStatesGlobal.pointingDirection,
	};

	// this convoluted  thingy is to not change pointing direction of all buildings, just this bulid this very moment
	cell.building = newBuilding;
	gameStatesGlobal.gameLog = [
		...gameStatesGlobal.gameLog,
		{
			message: `Built ${building.namePretty} in cell ${index}`,
			logType: "success",
		},
	];
	emitChange();
}
