import { Resource } from "../game-information/resources";
import {
	Building,
	BuildingFunction,
	BuildingName,
	BuildingThroughput,
	PointingDirection,
} from "./buildings";

export class TheBuilding {
	public name: BuildingName;
	public namePretty: string;
	public mapIcon: string;
	public baseCost: number;
	public inputs: { resource: Resource; amount: number }[];
	public outputs: { resource: Resource; amount: number }[];
	public pointingBuilding: boolean;
	public pointingDirection?: PointingDirection | undefined;
	public buildingFunction: BuildingFunction;
	public buildingResourceMine?: Resource | null | undefined;
	public buildingFunctionDescription?: string[] | undefined;
	public throughputModifiers?: BuildingThroughput | undefined;
	constructor(building: Building) {
		this.name = building.name;
		this.namePretty = building.namePretty;
		this.mapIcon = building.mapIcon;
		this.baseCost = building.baseCost;
		this.inputs = building.inputs;
		this.outputs = building.outputs;
		this.pointingBuilding = building.pointingBuilding;
		this.pointingDirection = building.pointingDirection;
		this.buildingFunction = building.buildingFunction;
		this.buildingResourceMine = building.buildingResourceMine;
		this.buildingFunctionDescription = building.buildingFunctionDescription;
		this.throughputModifiers = building.throughputModifiers;
	}

	/**
	 * Returns the amount of the resource input of the specific building. If no given resource is found, returns 0.
	 * @param building
	 * @param resource
	 * @returns The amount of the resource input of the specific building. If no given resource is found, returns 0.
	 */
	public getBuildingInput(resource: Resource): number {
		let amount =
			this.inputs.find((input) => input.resource.name === resource.name)
				?.amount ?? 0;
		if (amount === 0) return 0;
		if (!this.throughputModifiers) return amount;
		this.throughputModifiers?.forEach((modifier) => {
			if (modifier.type === "addative") {
				amount += modifier.modifier;
			} else {
				amount *= modifier.modifier;
			}
		});
		return Number(amount.toFixed(2));
	}

	/**
	 * Returns the amount of the resource output of the specific building. If no given resource is found, returns 0.
	 * @param resource
	 * @returns The amount of the resource output of the specific building. If no given resource is found, returns 0.
	 */
	public getBuildingOutput(resource: Resource): number {
		let amount =
			this.outputs.find(
				(output) => output.resource.name === resource.name,
			)?.amount ?? 0;
		if (amount === 0) return 0;
		if (!this.throughputModifiers) return amount;
		this.throughputModifiers?.forEach((modifier) => {
			if (modifier.type === "addative") {
				amount += modifier.modifier;
			} else {
				amount *= modifier.modifier;
			}
		});
		return Number(amount.toFixed(2));
	}
}
