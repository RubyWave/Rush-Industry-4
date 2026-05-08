import { useSyncExternalStore } from "react";
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
					<li key={resource.resource.name}>
						<span>
							{resource.resource.name}:{" "}
							{Number(resource.amount.toFixed(2))}
						</span>
						<span className="resource-price">
							{resource.resource.basePrice}€
						</span>
					</li>
				))}
			</ul>
		</div>
	);
};
