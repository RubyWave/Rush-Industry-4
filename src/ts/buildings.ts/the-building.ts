import { Board, BoardCell, CellIndex } from "../board/the-board";
import { Resource } from "../game-information/resources";
import { buildDestroyActions, oreMultiplier } from "./building-effects";
import {
	Building,
	BuildingEffect,
	BuildingFunction,
	BuildingName,
	BuildingThroughput,
	PointingDirection,
} from "./buildings";

export class TheBuilding implements Building {
	public name: BuildingName;
	public namePretty: string;
	public mapIcon: string;
	public baseCost: number;
	public inputs: { resource: Resource; amount: number }[];
	public outputs: { resource: Resource; amount: number }[];
	public pointingBuilding: boolean;
	public pointingDirection?: PointingDirection | undefined;
	public buildingFunction: BuildingFunction[];
	public buildingResourceMine?: Resource | null | undefined;
	public buildingFunctionDescription?: string[] | undefined;
	public throughputModifiers?: BuildingThroughput | undefined;
	public cellIndex?: CellIndex;
	public staticEffectActions?: BuildingFunction[];
	public emittedEffects?: BuildingEffect[];
	public receivedEffects?: BuildingEffect[];
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
		this.cellIndex = building.cellIndex ?? undefined;
		this.emittedEffects = building.emittedEffects ?? [];
		this.receivedEffects = building.receivedEffects ?? [];
	}

	/**
	 * Calculates the throughput modifier for a building
	 * @param building - The building to calculate the throughput modifier for.
	 * @returns The throughput modifier for the building. Neutral value is 1; 1.25 means 25% more throughput; 0.75 means 25% less throughput.
	 */
	private calculateThroughputModifier(building: Building): number {
		let wholeModifier = 1;
		building?.receivedEffects?.forEach((effect) => {
			if (effect.effectKind !== "BuildingThroughput") return;
			effect.theEffect.forEach((modifier) => {
				if (modifier.stackingType === "addative") {
					wholeModifier += modifier.modifier;
				} else if (modifier.stackingType === "multiplicative") {
					wholeModifier *= modifier.modifier;
				}
			});
		});
		return wholeModifier;
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

		amount *= this.calculateThroughputModifier(this);
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

		amount *= this.calculateThroughputModifier(this);
		return Number(amount.toFixed(2));
	}

	/**
	 * Function to be called when the building is built
	 */
	public onBuild(board: Board, cell: BoardCell): void {
		if (
			this.buildingResourceMine && // needs to check if this is set, otherwise empty cells will count as ore for building without set ore
			this.buildingResourceMine?.name === cell.resourceOre?.name
		) {
			oreMultiplier(this, cell);
		}
		buildDestroyActions(this.buildingFunction, this, board, true);
	}

	/**
	 * Function to be called when the building is destroyed
	 */
	public onDestroy(board: Board): void {
		buildDestroyActions(this.buildingFunction, this, board, false);
	}
}
