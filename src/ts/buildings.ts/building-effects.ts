/**
 * As functions can't be deep cloned, which is used to predict the income, functions must be stored separately.
 */

import { Board, BoardCell, getAllNeighbourCells } from "../board/the-board";
import { settings } from "../game-information/settings";
import {
	BuildingEffect,
	BuildingFunction,
	BuildingThroughput,
} from "./buildings";
import { TheBuilding } from "./the-building";

export function buildDestroyActions(
	actions: BuildingFunction[],
	building: TheBuilding,
	board: Board,
	build: boolean,
): void {
	actions.forEach((action) => {
		switch (action) {
			case "spreadThroughput":
				if (build) spreadThroughputBuild(building, board);
				else spreadThroughputDestroy(building);
				break;
		}
	});
	const neighbours = getAllNeighbourCells(board, building.cellIndex!);
	neighbours.forEach((neighbour) => {
		if (!neighbour.building) return;
		neighbour.building.buildingFunction.forEach((action) => {
			switch (action) {
				case "spreadThroughput":
					spreadThroughputRecive(neighbour.building!, building);
					break;
			}
		});
	});
}

function spreadThroughputBuild(building: TheBuilding, board: Board): void {
	const neighbours = getAllNeighbourCells(board, building.cellIndex!);
	neighbours.forEach((neighbour) => {
		if (!neighbour.building) return;
		const newEffect: BuildingEffect = {
			source: {
				sourceType: "building",
				source: building,
			},
			target: neighbour.building,
			effectKind: "BuildingThroughput",
			theEffect: [
				{
					modifier: 1.1,
					stackingType: "multiplicative",
					description: "Neighbour bonus from " + building.namePretty,
				},
			],
		};
		neighbour.building.receivedEffects = [
			...(neighbour.building.receivedEffects ?? []),
			newEffect as BuildingEffect,
		];
		building.emittedEffects = [
			...(building.emittedEffects ?? []),
			newEffect as BuildingEffect,
		];
	});
}

/**
 * In case when new building is built next to the source of this throughput.
 * @param building
 * @param board
 */
function spreadThroughputRecive(
	buildingSource: TheBuilding,
	buildingTarget: TheBuilding,
): void {
	const newEffect: BuildingEffect = {
		source: {
			sourceType: "building",
			source: buildingSource,
		},
		target: buildingTarget,
		effectKind: "BuildingThroughput",
		theEffect: [
			{
				modifier: 1.1,
				stackingType: "multiplicative",
				description:
					"Neighbour bonus from " + buildingSource.namePretty,
			},
		],
	};
	buildingTarget.receivedEffects = [
		...(buildingTarget.receivedEffects ?? []),
		newEffect as BuildingEffect,
	];
	buildingSource.emittedEffects = [
		...(buildingSource.emittedEffects ?? []),
		newEffect as BuildingEffect,
	];
}

function spreadThroughputDestroy(building: TheBuilding): void {
	building.emittedEffects?.forEach((effect) => {
		effect.target.receivedEffects = effect.target.receivedEffects?.filter(
			(e) => e !== effect,
		);
	});
}

export function oreMultiplier(building: TheBuilding, cell: BoardCell) {
	building.receivedEffects = [
		...(building.receivedEffects ?? []),
		{
			source: {
				sourceType: "cell",
				source: cell,
			},
			target: building,
			effectKind: "BuildingThroughput",
			theEffect: [
				{
					modifier: settings.oreThroughputModifier,
					stackingType: "addative",
					description: "Ore throughput bonus",
				},
			] as BuildingThroughput,
		},
	];
}
