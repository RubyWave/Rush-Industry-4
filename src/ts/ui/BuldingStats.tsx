import { useSyncExternalStore } from "react";
import { getSnapshot, subscribe } from "../game-information/gameStatesStore";
import { BuildingName } from "../buildings.ts/buildings";
import { availableBuildings } from "../buildings.ts/aviable-buildings";

export const BuildingStats = () => {
	const selectedBuilding = useSyncExternalStore(
		subscribe,
		() => getSnapshot().selectedBuilding,
	);
	if (!selectedBuilding) return null;
	const approximateInputCost = () => {
		return availableBuildings[
			selectedBuilding as BuildingName
		]?.inputs.reduce((acc, input) => {
			return acc + input.amount * input.resource.basePrice;
		}, 0);
	};
	const approximateOutputCost = () => {
		return availableBuildings[
			selectedBuilding as BuildingName
		]?.outputs.reduce((acc, output) => {
			return acc + output.amount * output.resource.basePrice;
		}, 0);
	};
	return (
		<div className="building-stats">
			<h3 className="building-stats__heading">
				{
					availableBuildings[selectedBuilding as BuildingName]
						?.namePretty
				}{" "}
				Stats
			</h3>
			<span className="building-stats__cost">
				cost:{" "}
				<span>
					{
						availableBuildings[selectedBuilding as BuildingName]
							?.baseCost
					}
					€
				</span>
			</span>
			<div className="building-stats__content">
				<div className="building-stats__inputs">
					<h4>Inputs</h4>
					{approximateInputCost() ? (
						<span className="building-stats__input-cost">
							~{Number(approximateInputCost()?.toFixed(2))} €
						</span>
					) : null}
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
					{approximateOutputCost() ? (
						<span className="building-stats__output-cost">
							~{Number(approximateOutputCost()?.toFixed(2))} €
						</span>
					) : null}
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
						]?.buildingFunctionDescription?.map(
							(description, index) => (
								<li key={index}>{description}</li>
							),
						)}
						{availableBuildings[selectedBuilding as BuildingName]
							?.buildingResourceMine && (
							<li>
								If placed on{" "}
								{
									availableBuildings[
										selectedBuilding as BuildingName
									]?.buildingResourceMine?.name
								}{" "}
								resource hex, throughput is increased by
								1.25x:{" "}
							</li>
						)}
					</ul>
				</div>
			</div>
		</div>
	);
};
