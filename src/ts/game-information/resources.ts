export interface Resource {
	/** Resource name */
	name: string;
	/** Resource short name, used on the board */
	shortName: string;
	/** Resource colour, used on the board and for UI */
	resourceColour: string;
	/** Resource base cost */
	basePrice: number;
}
export type Resources = { resource: Resource; amount: number }[];

export interface ResourcesStorage {
	resources: Resources;
}

interface AvailableResources {
	[key: string]: Resource;
}
export const availableResources: AvailableResources = {
	coal: {
		name: "coal",
		shortName: "C",
		resourceColour: "#1B2230",
		basePrice: 1,
	},
	iron: {
		name: "iron",
		shortName: "Fe",
		resourceColour: "#6B2D3A",
		basePrice: 2,
	},
	copper: {
		name: "copper",
		shortName: "Cu",
		resourceColour: "#4F4A3D",
		basePrice: 3,
	},
	rubber: {
		name: "rubber",
		shortName: "R",
		resourceColour: "#2E6B63",
		basePrice: 1,
	},
	electronics: {
		name: "electronics",
		shortName: "E",
		resourceColour: "#463A7A",
		basePrice: 9,
	},
	steel: {
		name: "steel",
		shortName: "St",
		resourceColour: "#355C7A",
		basePrice: 5,
	},
	machine: {
		name: "machine",
		shortName: "M",
		resourceColour: "#9FB24A",
		basePrice: 25,
	},
};
