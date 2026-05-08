import { BuildingName } from "./buildings";
import { availableResources, Resource, ResourcesStorage } from "./resources";

/**
 * Central snapshot of runtime simulation state. Extend this as the game grows.
 */
export interface GameStates {
	/** Ticks elapsed since the game started. */
	tickCounter: number;
	/** True if game Ticks are running */
	runState: boolean;
	/** Resources storage */
	resourcesStorage: ResourcesStorage;
	/** Cash in the bank */
	cash: number;
	/** Selected building  */
	selectedBuilding: BuildingName | null;
}

export function createGameStates(): GameStates {
	return {
		tickCounter: 0,
		runState: false,
		resourcesStorage: {
			resources: Object.values(availableResources).map(
				(resource: Resource) => ({
					resource,
					amount: 0,
				}),
			),
		},
		cash: 0,
		selectedBuilding: null,
	};
}
