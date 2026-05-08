import { gameStatesGlobal } from "../game-information/gameStatesStore";
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
	cell.building = building;
}
