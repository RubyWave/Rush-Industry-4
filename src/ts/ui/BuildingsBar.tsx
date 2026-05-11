import { availableBuildings } from "../buildings.ts/aviable-buildings";
import { useSyncExternalStore } from "react";
import {
	emitChange,
	gameStatesGlobal,
	getSnapshot,
	subscribe,
} from "../game-information/gameStatesStore";

export const BuildingsBar = () => {
	const selectedBuilding = useSyncExternalStore(
		subscribe,
		() => getSnapshot().selectedBuilding,
	);
	return (
		<ul className="buildings-bar">
			{Object.values(availableBuildings).map((building, index) => {
				let className = "building-button";
				if (selectedBuilding === building.name) {
					className += " selected";
				}
				return (
					<li
						key={building.name}
						className={className}
						onClick={() => {
							if (selectedBuilding === building.name) {
								gameStatesGlobal.selectedBuilding = null;
							} else {
								gameStatesGlobal.selectedBuilding =
									building.name;
							}
							emitChange();
						}}
					>
						{"(" + ++index + ")"}
						<br />
						{building.namePretty}
					</li>
				);
			})}
		</ul>
	);
};
