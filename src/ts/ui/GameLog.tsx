import { useEffect, useRef, useSyncExternalStore } from "react";
import { getSnapshot, subscribe } from "../game-information/gameStatesStore";
import { LogType } from "../game-information/game-states";

export const GameLog = () => {
	const gameLog = useSyncExternalStore(
		subscribe,
		() => getSnapshot().gameLog,
	);
	const logRef = useRef<HTMLUListElement | null>(null);

	useEffect(() => {
		const el = logRef.current;
		if (!el) return;
		// Keep newest entries visible (we render newest-first).
		el.scrollTop = 0;
	}, [gameLog.length]);

	const logTypeToClassName = (logType: LogType) => {
		return `log-${logType}`;
	};
	return (
		<ul ref={logRef} className="game-log">
			{[...gameLog].reverse().map((log, index) => {
				return (
					<li key={index} className={logTypeToClassName(log.logType)}>
						{log.message}
					</li>
				);
			})}
		</ul>
	);
};
