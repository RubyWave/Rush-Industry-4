import { availableResources } from "../game-information/resources";
import { Building } from "./buildings";

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
		buildingFunction: "output",
		buildingResourceMine: availableResources.coal,
	},
	ironMine: {
		name: "ironMine",
		namePretty: "Iron Mine",
		mapIcon: "Fe",
		baseCost: 125,
		inputs: [],
		outputs: [{ resource: availableResources.iron, amount: 2 }],
		pointingBuilding: false,
		buildingFunction: "output",
		buildingResourceMine: availableResources.iron,
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
		outputs: [{ resource: availableResources.steel, amount: 6 }],
		pointingBuilding: false,
		buildingFunction: "inputOutput",
		buildingFunctionDescription: [
			"This building will not output anything if no inputs are provided.",
		],
	},
	market: {
		name: "market",
		namePretty: "Market",
		mapIcon: "M",
		baseCost: 100,
		inputs: [],
		outputs: [],
		pointingBuilding: true,
		buildingFunction: "buysFromDirection",
		buildingFunctionDescription: [
			"Buys resources from the direction of the building. This is only way to sell the resources.",
			"To change the direction, click R while building is selected.",
		],
	},
};
