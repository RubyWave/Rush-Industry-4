/**
 * As functions can't be deep cloned, which is used to predict the income, functions must be stored separately.
 */

import { Board } from "../board/the-board";
import { TheBuilding } from "./the-building";

export type ActionType = "spreadThroughput";

export function buildDestroyActions(
	action: ActionType[],
	building: TheBuilding,
	board: Board,
	build: boolean,
): void {
	action.forEach((action) => {
		switch (action) {
			case "spreadThroughput":
				if (build) spreadThroughputBuild(building, board);
				else spreadThroughputDestroy(building, board);
				break;
		}
	});
}

function spreadThroughputBuild(building: TheBuilding, board: Board): void {
	console.log("spreading");
	console.log(building);
	console.log(board);
}
function spreadThroughputDestroy(building: TheBuilding, board: Board): void {
	console.log("destroying spreading");
	console.log(building);
	console.log(board);
}
