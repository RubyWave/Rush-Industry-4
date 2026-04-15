import { useSyncExternalStore } from "react";
import { getSnapshot, subscribe } from "../game-information/gameStatesStore";

export const CashDisplay = () => {
	const cash = useSyncExternalStore(subscribe, () => getSnapshot().cash);
	return (
		<div className="cash-display">
			<h3>Cash: {cash}€</h3>
		</div>
	);
};
