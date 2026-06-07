import { settings } from "../game-information/settings";
import { Building, BuildingPriceModifier } from "../buildings.ts/buildings";
// import { CellIndex, getNeighbourCell } from "../board/the-board";
import { Resources } from "../game-information/resources";
import { Board, CellIndex, getNeighbourCell } from "../board/the-board";
import { TheBuilding } from "../buildings.ts/the-building";

function buildingOutputs(
	building: TheBuilding,
	allResources: Resources,
	cash: number,
): [Resources, number] {
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

function buildingInputs(
	building: TheBuilding,
	allResources: Resources,
	cash: number,
	prediction: boolean = false,
): [Resources, number] {
	building.inputs.forEach((input) => {
		const resource = allResources.find(
			(resource) => resource.resource.name === input.resource.name,
		)!;
		const index = allResources.indexOf(resource);

		const inputAmount = building.getBuildingInput(input.resource);
		if (inputAmount === 0) return allResources;

		let adjustedInput = inputAmount / settings.tickInterval; // resources are consumed per second
		adjustedInput = Number(adjustedInput.toFixed(2));

		resource.amount -= adjustedInput;
		allResources[index] = resource;
	});

	[allResources, cash] = buyMissingResources(
		building,
		allResources,
		cash,
		prediction,
	);
	return [allResources, cash];
}

function buysFromDirectionBuilding(
	building: Building,
	allResources: Resources,
	cellIndex: CellIndex,
	cash: number,
	boardToCalculateFor: Board,
): [Resources, number] {
	const neighbourCell = getNeighbourCell(
		boardToCalculateFor,
		cellIndex,
		building.pointingDirection!,
	);
	if (!neighbourCell) return [allResources, cash];
	const neighbourBuilding = neighbourCell.building;
	if (!neighbourBuilding) return [allResources, cash];

	neighbourBuilding.outputs.forEach((output) => {
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
 * Buy resources that would be lower then 0 at the 3x base price.
 * @param allResources
 * @returns filtered allResources to not have any resource in stock of lower then 0
 */
function buyMissingResources(
	building: TheBuilding,
	allResources: Resources,
	cash: number,
	prediction: boolean = false,
): [Resources, number] {
	let buyCostModifier = 1; // lower the modifier, cheaper the resource
	building.receivedEffects?.forEach((effect) => {
		if (effect.effectKind !== "BuildingPriceModifier") return;
		(effect.theEffect as BuildingPriceModifier).forEach((modifier) => {
			buyCostModifier *= modifier.modifier;
		});
	});
	allResources.forEach((resource) => {
		if (resource.amount < 0) {
			const missingAmount = Math.abs(resource.amount);
			const cashPayed =
				missingAmount *
				resource.resource.basePrice *
				settings.resourceBuyPriceModifier *
				buyCostModifier;
			cash -= cashPayed;

			// when predicting, we want to see negative resources, so we shouldn't zero them
			if (!prediction) {
				resource.amount += missingAmount;
			}
		}
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
		// todo: probably this could be done in more optimised way
		boardToCalculateFor.hexes.forEach((row) => {
			row.forEach((cell) => {
				if (!cell.building) return;
				if (cell.building.outputs.length > 0) {
					[newAllResources, newCash] = buildingOutputs(
						cell.building,
						newAllResources,
						newCash,
					);
				} else if (
					cell.building.buildingFunctions.includes(
						"buysFromDirection",
					)
				) {
					[newAllResources, newCash] = buysFromDirectionBuilding(
						cell.building,
						newAllResources,
						cell.index,
						newCash,
						boardToCalculateFor,
					);
				}
			});
		});
		// needs to iterate twice. First for outputs, then, for inputs, to prevent circular dependencies in buying resources
		boardToCalculateFor.hexes.forEach((row) => {
			row.forEach((cell) => {
				if (!cell.building) return;
				if (cell.building.inputs.length > 0) {
					[newAllResources, newCash] = buildingInputs(
						cell.building,
						newAllResources,
						newCash,
						prediction,
					);
				}
			});
		});
	}
	return [newAllResources, newCash];
};
