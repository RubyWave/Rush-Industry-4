import { availableResources } from "./resources";

export const settings = {
	board: {
		hexSize: 40,
		cols: 8,
		rows: 6,
		resourcesOres: [
			{
				resource: availableResources.coal,
				tiles: 8,
			},
			{
				resource: availableResources.iron,
				tiles: 3,
			},
			{
				resource: availableResources.copper,
				tiles: 2,
			},
			{
				resource: availableResources.rubber, // yes, raw rubber is an ore, fight me
				tiles: 1,
			},
		],
	},
	startingCash: 1000,
	tickInterval: 5, // 5 ticks per second
	gameTime: 60, // time for the game in seconds
	mapPreviewTime: 30, // time for the map preview in seconds
	skipPreGame: false, // if true, the game will start immediately
};
