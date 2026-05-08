import { availableResources, Resource } from "./resources";

export type BuildingName = string;
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
	},
	ironMine: {
		name: "ironMine",
		namePretty: "Iron Mine",
		mapIcon: "Fe",
		baseCost: 125,
		inputs: [],
		outputs: [{ resource: availableResources.iron, amount: 3 }],
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
	},
};
