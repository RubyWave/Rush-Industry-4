import {
	emitChange,
	gameStatesGlobal,
} from "../game-information/gameStatesStore";
import {
	Board,
	CellIndex,
	getCell,
	isEqualCellIndex,
	redrawBoard,
} from "./the-board";
import { availableBuildings } from "../buildings.ts/aviable-buildings";
import { Building, BuildingBlueprint } from "../buildings.ts/buildings";
import { TheBuilding } from "../buildings.ts/the-building";
import { theBoard } from "../game-set-up";

/**
 *
 * @param board
 * @param index
 * @param building
 * @param blueprintBuilding
 * @param prediction
 * @returns
 */
export function buildBuilding(
	board: Board,
	index: CellIndex,
	building?: Building,
	blueprintBuilding: boolean = false,
	prediction: boolean = false,
) {
	if (!building) {
		building = Object.values(availableBuildings).find(
			(b) => b.name === gameStatesGlobal.selectedBuilding,
		);
		if (!building) return;
	}
	const cell = getCell(board, index);
	if (!cell) return;

	if (building.name === "bulldozer" && !prediction) {
		if (cell.building) {
			gameStatesGlobal.gameLog = [
				...gameStatesGlobal.gameLog,
				{
					message: `Bulldozed ${cell.building.namePretty} in cell ${index}`,
					logType: "warning",
				},
			];
		} else if (cell.buildingBlueprint) {
			cell.buildingBlueprint = null;
			gameStatesGlobal.buildQueue = gameStatesGlobal.buildQueue.filter(
				(blueprint) => {
					return !isEqualCellIndex(blueprint.cellIndex, index);
				},
			);
			gameStatesGlobal.gameLog = [
				...gameStatesGlobal.gameLog,
				{
					message: `Removed blueprint from cell ${index}`,
					logType: "warning",
				},
			];
		}

		if (cell.building instanceof TheBuilding) {
			cell.building = null;
		}
		emitChange();
		return;
	}
	if (cell.building) return;
	if (
		(gameStatesGlobal.cash < building.baseCost && !prediction) ||
		(gameStatesGlobal.keyStates.shift && !blueprintBuilding)
	) {
		if (cell.buildingBlueprint) return;
		if (gameStatesGlobal.cash < building.baseCost) {
			gameStatesGlobal.gameLog = [
				...gameStatesGlobal.gameLog,
				{
					message: `Not enough cash to build ${building.namePretty} in cell ${index}`,
					logType: "error",
				},
			];
		}
		const buildingBlueprint: BuildingBlueprint = {
			building,
			cellIndex: index,
		};
		gameStatesGlobal.buildQueue = [
			...gameStatesGlobal.buildQueue,
			buildingBlueprint,
		];
		cell.buildingBlueprint = buildingBlueprint;
		gameStatesGlobal.gameLog = [
			...gameStatesGlobal.gameLog,
			{
				message: `Adding ${building.namePretty} to build queue in cell ${index}`,
				logType: "info",
			},
		];
		emitChange();
		return;
	}

	if (!prediction) {
		gameStatesGlobal.cash -= building.baseCost;
	}

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
	cell.building = new TheBuilding(newBuilding);
	if (!prediction) {
		gameStatesGlobal.gameLog = [
			...gameStatesGlobal.gameLog,
			{
				message: `Built ${building.namePretty} in cell ${index}`,
				logType: "success",
			},
		];
	}
	emitChange();
	redrawBoard();
}

export function buildFromQueue() {
	const buildingBlueprint = gameStatesGlobal.buildQueue[0];
	if (!buildingBlueprint) return;
	if (gameStatesGlobal.cash < buildingBlueprint.building.baseCost) return;
	buildBuilding(
		theBoard,
		buildingBlueprint.cellIndex,
		buildingBlueprint.building,
		true,
	);
	gameStatesGlobal.buildQueue = gameStatesGlobal.buildQueue.slice(1);
	emitChange();
}
