import { gameStatesGlobal } from "../game-information/gameStatesStore";
import { settings } from "../game-information/settings";
import { board } from "../game-set-up";
import { Building } from "../game-information/buildings";
// import { CellIndex, getNeighborCell } from "../board/the-board";
import { Resources } from "../game-information/resources";
import { CellIndex, getNeighborCell } from "../board/the-board";

function inputOutputBuilding(
	building: Building,
	allResources: Resources,
): Resources {
	let buildingHaveInputs = true;

	building.inputs.forEach((input) => {
		if (!buildingHaveInputs) return;
		const resource = allResources.find(
			(resource) => resource.resource.name === input.resource.name,
		)!;
		const index = allResources.indexOf(resource);

		let adjustedInput = input.amount / settings.tickInterval; // resources are consumed per second
		adjustedInput = Number(adjustedInput.toFixed(2));

		if (resource.amount < adjustedInput) {
			buildingHaveInputs = false;
		} else {
			resource.amount -= adjustedInput;
			allResources[index] = resource;
		}
	});
	if (!buildingHaveInputs) return allResources; // for now, building must have all inputs to work
	building.outputs.forEach((output) => {
		const resource = allResources.find(
			(resource) => resource.resource.name === output.resource.name,
		)!;
		const index = allResources.indexOf(resource);

		let adjustedOutput = output.amount / settings.tickInterval; // resources are produced per second
		adjustedOutput = Number(adjustedOutput.toFixed(2));

		resource.amount += adjustedOutput;
		allResources[index] = resource;
	});
	return allResources;
}

function buysFromDirectionBuilding(
	building: Building,
	allResources: Resources,
	cellIndex: CellIndex,
): Resources {
	const neighborCell = getNeighborCell(
		board,
		cellIndex,
		building.pointingDirection!,
	);
	if (!neighborCell) return allResources;
	const neighborBuilding = neighborCell.building;
	if (!neighborBuilding) return allResources;

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

		const cashEarned = adjustedOutput * output.resource.basePrice;
		gameStatesGlobal.cash += cashEarned;

		resource.amount -= adjustedOutput;
		allResources[index] = resource;
	});
	return allResources;
}

export const calculateResourceProduction = () => {
	board.hexes.forEach((row) => {
		row.forEach((cell) => {
			if (cell.building) {
				let allResources = gameStatesGlobal.resourcesStorage.resources;
				switch (cell.building.specialFunctions) {
					case "inputOutput":
					case "output":
						allResources = inputOutputBuilding(
							cell.building,
							allResources,
						);
						break;
					case "buysFromDirection":
						allResources = buysFromDirectionBuilding(
							cell.building,
							allResources,
							cell.index,
						);
						break;
				}
				gameStatesGlobal.resourcesStorage = {
					...gameStatesGlobal.resourcesStorage,
					resources: [...allResources],
				};
			}
		});
	});
};
