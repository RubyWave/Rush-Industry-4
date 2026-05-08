import { BuildingName, PointingDirection } from "./buildings";
import { availableResources, Resource, ResourcesStorage } from "./resources";
import { settings } from "./settings";

export type LogType = "info" | "error" | "warning" | "success";
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
	/** Curently hovered hex pointing direction */
	pointingDirection: PointingDirection | null;
	/** Game log */
	gameLog: { message: string; logType: LogType }[];
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
		cash: settings.startingCash,
		selectedBuilding: null,
		pointingDirection: "upLeft",
		gameLog: [{ message: "Welcome to the game!", logType: "info" }],
	};
}
