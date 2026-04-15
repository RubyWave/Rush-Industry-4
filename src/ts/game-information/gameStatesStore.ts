import { createGameStates, GameStates } from "./game-states";

export const gameStatesGlobal: GameStates = createGameStates();

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribe(listener: Listener): () => void {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

export function getSnapshot(): GameStates {
	return gameStatesGlobal; // same object reference is OK; subscription triggers re-render
}

export function emitChange(): void {
	for (const l of listeners) l();
}
