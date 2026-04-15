import { useSyncExternalStore } from "react";
import { getSnapshot, subscribe } from "../game-information/gameStatesStore";

export const ExampleElement = () => {
	// const gameStates = useContext(GameStatesContext);
	// console.log("ticks: ", gameStates);
	// const gameStates = useSyncExternalStore(subscribe, getSnapshot);
	const tickCounter = useSyncExternalStore(
		subscribe,
		() => getSnapshot().tickCounter,
	);
	return <div>Example Element {tickCounter}</div>;
};
