import { settings } from "../game-information/settings";
import { Building } from "../buildings.ts/buildings";
// import { CellIndex, getNeighborCell } from "../board/the-board";
import { Resources } from "../game-information/resources";
import { Board, CellIndex, getNeighborCell } from "../board/the-board";
import { TheBuilding } from "../buildings.ts/the-building";

function inputOutputBuilding(
	building: TheBuilding,
	allResources: Resources,
	cash: number,
	prediction: boolean = false,
): [Resources, number] {
	let buildingHaveInputs = true;

	building.inputs.forEach((input) => {
		if (!buildingHaveInputs) return;
		const resource = allResources.find(
			(resource) => resource.resource.name === input.resource.name,
		)!;
		const index = allResources.indexOf(resource);

		const outputAmount = building.getBuildingInput(input.resource);
		if (outputAmount === 0) return allResources;

		let adjustedInput = outputAmount / settings.tickInterval; // resources are consumed per second
		adjustedInput = Number(adjustedInput.toFixed(2));

		if (resource.amount < adjustedInput && !prediction) {
			buildingHaveInputs = false;
		} else {
			resource.amount -= adjustedInput;
			allResources[index] = resource;
		}
	});
	if (!buildingHaveInputs) return [allResources, cash]; // for now, building must have all inputs to work
	building.outputs.forEach((output) => {
		const resource = allResources.find(
			(resource) => resource.resource.name === output.resource.name,
		)!;
		const index = allResources.indexOf(resource);

		const outputAmount = building.getBuildingOutput(output.resource);

		if (outputAmount === 0) return allResources;

		let adjustedOutput = outputAmount / settings.tickInterval; // resources are produced per second
		adjustedOutput = Number(adjustedOutput.toFixed(2));

		resource.amount += adjustedOutput;
		allResources[index] = resource;
	});
	return [allResources, cash];
}

function buysFromDirectionBuilding(
	building: Building,
	allResources: Resources,
	cellIndex: CellIndex,
	cash: number,
	boardToCalculateFor: Board,
): [Resources, number] {
	const neighborCell = getNeighborCell(
		boardToCalculateFor,
		cellIndex,
		building.pointingDirection!,
	);
	if (!neighborCell) return [allResources, cash];
	const neighborBuilding = neighborCell.building;
	if (!neighborBuilding) return [allResources, cash];

	neighborBuilding.outputs.forEach((output) => {
		const resource = allResources.find(
			(resource) => resource.resource.name === output.resource.name,
		)!;
		const index = allResources.indexOf(resource);

		let adjustedOutput = output.amount / settings.tickInterval; // resources are produced per second
		adjustedOutput = Number(adjustedOutput.toFixed(2));

		if (resource.amount < adjustedOutput) {
			return false;
		}

		cash = Number(
			(cash + adjustedOutput * output.resource.basePrice).toFixed(2),
		);

		resource.amount -= adjustedOutput;
		allResources[index] = resource;
	});
	return [allResources, cash];
}

/**
 * Calculate new resources after one tick.
 * @param ticksNumber - The number of ticks to calculate.
 * @param boardToCalculateFor - The board to calculate the resource production for. This will be used for a case of predicting the resource production for a new building
 * @param prediction - If true, it will assume all buildings are working, no matter missing inputs.
 * @returns
 */
export const calculateResourceProduction = (
	newAllResources: Resources,
	newCash: number,
	ticksNumber: number = 1, // TODO: check if this isn't to computationally expensive
	boardToCalculateFor: Board,
	prediction: boolean = false,
): [Resources, number] => {
	for (let i = 0; i < ticksNumber; i++) {
		boardToCalculateFor.hexes.forEach((row) => {
			row.forEach((cell) => {
				if (cell.building) {
					switch (cell.building.buildingFunction) {
						case "inputOutput":
						case "output":
							[newAllResources, newCash] = inputOutputBuilding(
								cell.building,
								newAllResources,
								newCash,
								prediction,
							);
							break;
						case "buysFromDirection":
							[newAllResources, newCash] =
								buysFromDirectionBuilding(
									cell.building,
									newAllResources,
									cell.index,
									newCash,
									boardToCalculateFor,
								);
							break;
					}
				}
			});
		});
	}
	return [newAllResources, newCash];
};
