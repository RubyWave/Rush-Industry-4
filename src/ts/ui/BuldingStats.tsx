import { useSyncExternalStore } from "react";
import { getSnapshot, subscribe } from "../game-information/gameStatesStore";
import {
	availableBuildings,
	BuildingName,
} from "../game-information/buildings";

export const BuildingStats = () => {
	const selectedBuilding = useSyncExternalStore(
		subscribe,
		() => getSnapshot().selectedBuilding,
	);
	return (
		<div className="building-stats">
			<h3 className="building-stats__heading">
				{
					availableBuildings[selectedBuilding as BuildingName]
						?.namePretty
				}{" "}
				Stats
			</h3>
			<div className="building-stats__content">
				<div className="building-stats__inputs">
					<h4>Inputs</h4>
					<ul>
						{availableBuildings[
							selectedBuilding as BuildingName
						]?.inputs.map((input) => (
							<li key={input.resource.name}>
								{input.resource.name}: {input.amount}
							</li>
						))}
					</ul>
				</div>
				<div className="building-stats__outputs">
					<h4>Outputs</h4>
					<ul>
						{availableBuildings[
							selectedBuilding as BuildingName
						]?.outputs.map((output) => (
							<li key={output.resource.name}>
								{output.resource.name}: {output.amount}
							</li>
						))}
					</ul>
				</div>
				<div className="building-stats__special-functions">
					<h4>Special Functions</h4>
					<ul>
						{availableBuildings[
							selectedBuilding as BuildingName
						]?.specialFunctionsDescription?.map(
							(description, index) => (
								<li key={index}>{description}</li>
							),
						)}
					</ul>
				</div>
			</div>
		</div>
	);
};
