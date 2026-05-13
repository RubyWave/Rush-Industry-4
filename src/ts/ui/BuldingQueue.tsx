import { useSyncExternalStore } from "react";
import { getSnapshot, subscribe } from "../game-information/gameStatesStore";

export const BuildingQueue = () => {
	const buildQueue = useSyncExternalStore(
		subscribe,
		() => getSnapshot().buildQueue,
	);
	const cash = useSyncExternalStore(subscribe, () => getSnapshot().cash);
	function getCostOfEarlierBuildings(index: number) {
		let cost = 0;
		for (let i = 0; i < index; i++) {
			cost += buildQueue[i].building.baseCost;
		}
		return cost;
	}
	return (
		<ul className="build-queue">
			{Object.values(buildQueue).map((buildingBlueprint, index) => {
				return (
					<li
						key={
							buildingBlueprint.building.name +
							buildingBlueprint.cellIndex.toString()
						}
						className="build-queue-item"
					>
						<span>{++index}.</span>
						<span>{buildingBlueprint.building.namePretty}</span>
						<span className="build-queue-item__cell">
							cell: {buildingBlueprint.cellIndex[0]},{" "}
							{buildingBlueprint.cellIndex[1]}
						</span>
						<span className="build-queue-item__missing-cost">
							{(cash - getCostOfEarlierBuildings(index)).toFixed(
								2,
							)}
							€
						</span>
					</li>
				);
			})}
			<li className="build-queue-item">
				<h4>Building queue</h4>
			</li>
		</ul>
	);
};
