export interface Resource {
	/** Resource name */
	name: string;
	/** Resource base cost */
	baseCost: number;
}

export interface ResourcesStorage {
	resources: { resource: Resource; amount: number }[];
}

interface AvailableResources {
	[key: string]: Resource;
}
export const availableResources: AvailableResources = {
	coal: { name: "coal", baseCost: 1 },
	iron: { name: "iron", baseCost: 2 },
	steel: { name: "steel", baseCost: 5 },
};
