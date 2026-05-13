import {
	emitChange,
	gameStatesGlobal,
} from "../game-information/gameStatesStore";
import { CellIndex, getCell, redrawBoard } from "./the-board";
import { board } from "../game-set-up";
import { availableBuildings } from "../buildings.ts/aviable-buildings";
import { Building, BuildingBlueprint } from "../buildings.ts/buildings";

export function buildBuilding(
	index: CellIndex,
	building?: Building,
	blueprintBuilding = false,
) {
	if (!building) {
		building = Object.values(availableBuildings).find(
			(b) => b.name === gameStatesGlobal.selectedBuilding,
		);
		if (!building) return;
	}
	const cell = getCell(board, index);
	if (!cell) return;

	if (building.name === "bulldozer" && cell.building) {
		gameStatesGlobal.gameLog = [
			...gameStatesGlobal.gameLog,
			{
				message: `Bulldozed ${cell.building.namePretty} in cell ${index}`,
				logType: "warning",
			},
		];
		cell.building = null;
		emitChange();
		return;
	}

	if (
		gameStatesGlobal.cash < building.baseCost ||
		(gameStatesGlobal.keyStates.shift && !blueprintBuilding)
	) {
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
	if (cell.building) return;
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
	redrawBoard();
}

export function buildFromQueue() {
	const buildingBlueprint = gameStatesGlobal.buildQueue[0];
	if (!buildingBlueprint) return;
	if (gameStatesGlobal.cash < buildingBlueprint.building.baseCost) return;
	buildBuilding(
		buildingBlueprint.cellIndex,
		buildingBlueprint.building,
		true,
	);
	gameStatesGlobal.buildQueue = gameStatesGlobal.buildQueue.slice(1);
	emitChange();
}
