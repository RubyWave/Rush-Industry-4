import { CellIndex } from "../board/the-board";
import { Resource } from "../game-information/resources";

export type BuildingName = string;
export type PointingDirection =
	| "upLeft"
	| "upRight"
	| "left"
	| "right"
	| "downLeft"
	| "downRight"
	| null;
export type BuildingFunction =
	| "output"
	| "inputOutput"
	| "buysFromDirection"
	| "bulldozeBuilding";

/** Default throughput is 1. */
export type BuildingThroughput = {
	/** Should be kept between 0 and 1.  */
	modifier: number;
	type: "addative" | "multiplicative";
	description?: string;
}[];

export interface BuildingBlueprint {
	building: Building;
	cellIndex: CellIndex;
}
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
	buildingFunction: BuildingFunction;
	/** Some buildings are mines, and will get throughput multiplier if they are placed on resource hex*/
	buildingResourceMine?: Resource | null;
	/** Description of the special functions */
	buildingFunctionDescription?: string[];
	/** Building throughput modifiers */
	throughputModifiers?: BuildingThroughput;
}
