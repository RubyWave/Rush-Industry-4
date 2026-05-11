import { useSyncExternalStore, type CSSProperties } from "react";
import { getSnapshot, subscribe } from "../game-information/gameStatesStore";

export const ResourcesStorage = () => {
	const resources = useSyncExternalStore(
		subscribe,
		() => getSnapshot().resourcesStorage.resources,
	);
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
						>
							{resource.resource.shortName}
						</span>
						<span className="resource__name">
							{resource.resource.name}:{" "}
						</span>
						<span className="resource__amount-value">
							{Number(resource.amount.toFixed(2))}
						</span>
						<span className="resource__price">
							{resource.resource.basePrice}€
						</span>
					</li>
				))}
			</ul>
		</div>
	);
};
