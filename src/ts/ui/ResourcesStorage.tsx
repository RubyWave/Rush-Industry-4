import {
	useEffect,
	useState,
	useSyncExternalStore,
	type CSSProperties,
} from "react";
import { getSnapshot, subscribe } from "../game-information/gameStatesStore";
import { calculateResourceProduction } from "../tick-actions/resource-calculations";
import {
	availableResources,
	Resource,
	Resources,
} from "../game-information/resources";
import { settings } from "../game-information/settings";
import { theBoard } from "../game-set-up";
import { cloneBoard, getHoveredCell } from "../board/the-board";
import { availableBuildings } from "../buildings.ts/aviable-buildings";
import { TheBuilding } from "../buildings.ts/the-building";
import { BuildingName } from "../buildings.ts/buildings";
import { buildBuilding } from "../board/build-building";

export const ResourcesStorage = () => {
	const resources = useSyncExternalStore(
		subscribe,
		() => getSnapshot().resourcesStorage.resources,
	);
	const tickCounter = useSyncExternalStore(
		subscribe,
		() => getSnapshot().tickCounter,
	);

	const [nextTickResources, setNextTickResources] = useState<Resources>([]);
	const [nextTickCash, setNextTickCash] = useState<number>(0);
	const cash = useSyncExternalStore(subscribe, () => getSnapshot().cash);
	const selectedBuilding = useSyncExternalStore(
		subscribe,
		() => getSnapshot().selectedBuilding,
	);

	useEffect(() => {
		predictResourceProduction(
			selectedBuilding,
			setNextTickResources,
			setNextTickCash,
		);
	}, [tickCounter]);

	return (
		<div className="resources-storage">
			<h3>Resources Storage</h3>
			<ul className="resources-list">
				{resources.map((resource) => (
					<li key={resource.resource.name} className="resource">
						<span
							className="resource__short-name"
							data-color={resource.resource.resourceColour}
							style={
								{
									"--resource-color":
										resource.resource.resourceColour,
								} as CSSProperties
							}
							title={resource.resource.name}
						>
							{resource.resource.shortName}
						</span>
						<span
							className="resource__amount-value"
							title="amount of resource in storage"
						>
							{Number(resource.amount.toFixed(2))}
						</span>
						<span
							className="resource__income-value"
							title="income per second, assuming all buildings are working, ie all inputs are available"
						>
							(
							{Number(
								nextTickResources
									.find(
										(r) =>
											r.resource.name ===
											resource.resource.name,
									)
									?.amount.toFixed(2),
							) * settings.tickInterval}
							/s)
						</span>
						<span
							className="resource__price"
							title="base price of resource"
						>
							{resource.resource.basePrice}€
						</span>
					</li>
				))}
			</ul>
			<div className="cash-display">
				<h3 title="cash in storage, and income per second, assuming all buildings are working, ie all inputs are available">
					Cash: {Number(cash.toFixed(2))}€ (
					{Number((nextTickCash * settings.tickInterval).toFixed(2))}
					€/s)
				</h3>
			</div>
		</div>
	);
};

/**
 * Predict the resource production for the next tick, with preview for hovered building.
 * @param selectedBuilding - The building to predict the resource production for.
 * @param setNextTickResources - The function to set the next tick resources.
 * @param setNextTickCash - The function to set the next tick cash.
 */
function predictResourceProduction(
	selectedBuilding: BuildingName | null,
	setNextTickResources: (resources: Resources) => void,
	setNextTickCash: (cash: number) => void,
): void {
	const currentlyHoveredOnCell = getHoveredCell();
	const predictedBoard = cloneBoard(theBoard);

	if (currentlyHoveredOnCell && selectedBuilding) {
		if (settings.buildingPredictionDisabled) return;
		const predictedBuilding = new TheBuilding(
			Object.values(availableBuildings).find(
				(building) => building.name === selectedBuilding,
			)!,
		);
		buildBuilding(
			predictedBoard,
			currentlyHoveredOnCell,
			predictedBuilding,
			false,
			true,
		);
	}
	const [resources, cash] = (() => {
		const emptyResourcesStorage = {
			resources: Object.values(availableResources).map(
				(resource: Resource) => ({
					resource,
					amount: 0,
				}),
			),
		};
		const [resourcesFromSingleTick, cashFromSingleTick] =
			calculateResourceProduction(
				emptyResourcesStorage.resources,
				0,
				1,
				predictedBoard,
				true,
			);

		return [resourcesFromSingleTick, cashFromSingleTick];
	})();
	setNextTickResources(resources);
	setNextTickCash(cash);
}
