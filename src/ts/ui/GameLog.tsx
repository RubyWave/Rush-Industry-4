import { useSyncExternalStore } from "react";
import { getSnapshot, subscribe } from "../game-information/gameStatesStore";
import { LogType } from "../game-information/game-states";

export const GameLog = () => {
	const gameLog = useSyncExternalStore(
		subscribe,
		() => getSnapshot().gameLog,
	);
	const logTypeToClassName = (logType: LogType) => {
		return `log-${logType}`;
	};
	return (
		<ul className="game-log">
			{gameLog.map((log, index) => {
				return (
					<li key={index} className={logTypeToClassName(log.logType)}>
						{log.message}
					</li>
				);
			})}
		</ul>
	);
};
