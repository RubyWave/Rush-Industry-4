import {
	BuildingName,
	BuildingBlueprint,
	PointingDirection,
} from "../buildings.ts/buildings";
import { KeyStates } from "../controls";
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
	runState: "pregame" | "map-viewing" | "game-running" | "post-game";
	/** Random seed for the game */
	randomSeed: number;
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
	/** Build queue. If there is not enough cash to build the building, it is added to the queue. When enough cash is available, the first building in the queue is built. */
	buildQueue: BuildingBlueprint[];
	/** Key states */
	keyStates: KeyStates;
}

export function createGameStates(): GameStates {
	return {
		tickCounter: 0,
		runState: "pregame",
		randomSeed: Math.floor(Math.random() * 1000000),
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
		buildQueue: [],
		keyStates: {
			shift: false,
			ctrl: false,
			alt: false,
		},
	};
}
