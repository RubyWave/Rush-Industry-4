import { Board, BoardCell, CellIndex } from "../board/the-board";
import { Resource } from "../game-information/resources";
import { ActionType } from "./building-effects";

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
	| "effectSpreading"
	| "buysFromDirection"
	| "bulldozeBuilding";

/** Default throughput is 1. */
export type BuildingThroughput = {
	/** Should be kept between 0 and 1.  */
	modifier: number;
	type: "addative" | "multiplicative";
	description?: string;
}[];

export type BuildingEffect = {
	/** for a case of ore in the hex, source can be a cell index */
	source: {
		sourceType: "building" | "cell";
		source: Building | BoardCell;
	};
	target: Building;
	effectKind: "BuildingThroughput";
	theEffect: BuildingThroughput;
};

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
	/** Cell index of the building */
	cellIndex?: CellIndex;
	/** Actions to be performed when the building is built */
	staticEffectActions?: ActionType[];
	/** Effects emitted by the building */
	emittedEffects?: BuildingEffect[];
	/** Effects received by the building */
	receivedEffects?: BuildingEffect[];
	/** Function to get the amount of the resource input of the specific building */
	getBuildingInput?: (resource: Resource) => number;
	/** Function to get the amount of the resource output of the specific building */
	getBuildingOutput?: (resource: Resource) => number;
	/** Function to be called when the building is built */
	onBuild?: (board: Board, cell: BoardCell) => void;
	/** Function to be called when the building is destroyed */
	onDestroy?: (board: Board) => void;
}
