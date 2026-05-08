import {
	emitChange,
	gameStatesGlobal,
} from "../game-information/gameStatesStore";
import { CellIndex, getCell } from "./the-board";
import { board } from "../game-set-up";
import { availableBuildings } from "../game-information/buildings";

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

	cell.building = building;
	gameStatesGlobal.gameLog = [
		...gameStatesGlobal.gameLog,
		{
			message: `Built ${building.namePretty} in cell ${index}`,
			logType: "success",
		},
	];
	emitChange();
}
