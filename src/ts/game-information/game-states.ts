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
	};
}
