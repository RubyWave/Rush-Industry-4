import { availableResources, Resource } from "./resources";

export type BuildingName = string;
export type PointingDirection =
	| "upLeft"
	| "upRight"
	| "left"
	| "right"
	| "downLeft"
	| "downRight"
	| null;
export type BuildingFunction = "output" | "inputOutput" | "buysFromDirection";
export interface Building {
	/** Building name */
	name: BuildingName;
	/** Building pretty name */
	namePretty: string;
	/** Building map icon displayed on the board */
	mapIcon: string;
	/** Building base cost */
	baseCost: number;
	/** Building inputs, resource per second */
	inputs: { resource: Resource; amount: number }[];
	/** Building outputs, resource per second */
	outputs: { resource: Resource; amount: number }[];
	/** Some buildings only interact in specific direction */
	pointingBuilding: boolean;
	/** Pointing direction of the building */
	pointingDirection?: PointingDirection;
	/** Special functions that the building can perform */
	specialFunctions: BuildingFunction;
}

interface AvailableBuildings {
	[key: string]: Building;
}
export const availableBuildings: AvailableBuildings = {
	coalMine: {
		name: "coalMine",
		namePretty: "Coal Mine",
		mapIcon: "C",
		baseCost: 100,
		inputs: [],
		outputs: [{ resource: availableResources.coal, amount: 5 }],
		pointingBuilding: false,
		specialFunctions: "output",
	},
	ironMine: {
		name: "ironMine",
		namePretty: "Iron Mine",
		mapIcon: "Fe",
		baseCost: 125,
		inputs: [],
		outputs: [{ resource: availableResources.iron, amount: 3 }],
		pointingBuilding: false,
		specialFunctions: "output",
	},
	steelMill: {
		name: "steelMill",
		namePretty: "Steel Mill",
		mapIcon: "St",
		baseCost: 300,
		inputs: [
			{ resource: availableResources.iron, amount: 5 },
			{ resource: availableResources.coal, amount: 1 },
		],
		outputs: [{ resource: availableResources.steel, amount: 5 }],
		pointingBuilding: false,
		specialFunctions: "inputOutput",
	},
	market: {
		name: "market",
		namePretty: "Market",
		mapIcon: "M",
		baseCost: 100,
		inputs: [],
		outputs: [],
		pointingBuilding: true,
		specialFunctions: "buysFromDirection",
	},
};
