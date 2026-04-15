import { useSyncExternalStore } from "react";
import { getSnapshot, subscribe } from "../game-information/gameStatesStore";

export const ResourcesStorage = () => {
	const resourcesStorage = useSyncExternalStore(
		subscribe,
		() => getSnapshot().resourcesStorage,
	);
	return (
		<div className="resources-storage">
			<h3>Resources Storage</h3>
			<ul className="resources-list">
				{resourcesStorage.resources.map((resource) => (
					<li key={resource.resource.name}>
						{resource.resource.name}: {resource.amount}
					</li>
				))}
			</ul>
		</div>
	);
};
