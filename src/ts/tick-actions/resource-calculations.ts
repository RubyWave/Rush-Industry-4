import {
	emitChange,
	gameStatesGlobal,
} from "../game-information/gameStatesStore";
import { board } from "../game-set-up";

export const calculateResourceProduction = () => {
	board.hexes.forEach((row) => {
		row.forEach((cell) => {
			if (cell.building) {
				let buildingHaveInputs = true;
				const allResources =
					gameStatesGlobal.resourcesStorage.resources;

				cell.building.inputs.forEach((input) => {
					if (!buildingHaveInputs) return;
					const resource = allResources.find(
						(resource) =>
							resource.resource.name === input.resource.name,
					)!;
					const index = allResources.indexOf(resource);

					if (resource.amount < input.amount) {
						buildingHaveInputs = false;
					} else {
						resource.amount -= input.amount;
						allResources[index] = resource;
						gameStatesGlobal.resourcesStorage = {
							...gameStatesGlobal.resourcesStorage,
							resources: [...allResources],
						};
					}
				});
				if (!buildingHaveInputs) return; // for now, building must have all inputs to work
				cell.building.outputs.forEach((output) => {
					const resource = allResources.find(
						(resource) =>
							resource.resource.name === output.resource.name,
					)!;
					const index = allResources.indexOf(resource);

					resource.amount += output.amount;
					allResources[index] = resource;
					gameStatesGlobal.resourcesStorage = {
						...gameStatesGlobal.resourcesStorage,
						resources: [...allResources],
					};
				});
			}
		});
	});

	emitChange();
	return;
};
