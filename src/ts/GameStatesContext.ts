import { createContext } from "react";
import { GameStates } from "./game-information/game-states";

export const GameStatesContext = createContext<GameStates | null>(null);
