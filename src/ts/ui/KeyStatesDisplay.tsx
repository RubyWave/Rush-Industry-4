import { useSyncExternalStore } from "react";
import { getSnapshot, subscribe } from "../game-information/gameStatesStore";

export const KeyStatesDisplay = () => {
	const keyStates = useSyncExternalStore(
		subscribe,
		() => getSnapshot().keyStates,
	);
	return (
		<div className="key-states-display">
			<h3>Modes</h3>
			<ul className="key-states-list">
				<li>
					Build behaviour:{" "}
					{keyStates.shift ? "add to the queue" : "normally"}
				</li>
			</ul>
		</div>
	);
};
