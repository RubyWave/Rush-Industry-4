export interface Resource {
	/** Resource name */
	name: string;
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
	coal: { name: "coal", basePrice: 1 },
	iron: { name: "iron", basePrice: 2 },
	steel: { name: "steel", basePrice: 5 },
};
