import { ResourcesStorage } from "../game-information/resources";
import { uiLayer } from "../game-set-up";

let resourcesStorageContainer: HTMLDivElement | null = null;
const resourceAmountElementsByName = new Map<string, HTMLSpanElement>();

export function initResourcesStorageUI(resourcesStorage: ResourcesStorage) {
	if (resourcesStorageContainer) return;

	resourcesStorageContainer = document.createElement("div");
	resourcesStorageContainer.className = "resources-storage-container";

	const resourcesStorageList = document.createElement("ul");
	resourcesStorageList.className = "resources-storage-list";
	resourcesStorageContainer.appendChild(resourcesStorageList);

	for (const { resource } of resourcesStorage.resources) {
		const li = document.createElement("li");
		li.className = "resources-storage-list-item";

		const nameEl = document.createElement("span");
		nameEl.className = "resource-name";
		nameEl.textContent = resource.name;

		const separatorEl = document.createElement("span");
		separatorEl.className = "resource-separator";
		separatorEl.textContent = ": ";

		const amountEl = document.createElement("span");
		amountEl.className = "resource-amount";
		amountEl.textContent = "0";

		li.appendChild(nameEl);
		li.appendChild(separatorEl);
		li.appendChild(amountEl);

		resourcesStorageList.appendChild(li);
		resourceAmountElementsByName.set(resource.name, amountEl);
	}

	uiLayer.appendChild(resourcesStorageContainer);
}

export function updateResourcesStorageUI(resourcesStorage: ResourcesStorage) {
	initResourcesStorageUI(resourcesStorage);

	for (const { resource, amount } of resourcesStorage.resources) {
		const amountEl = resourceAmountElementsByName.get(resource.name);
		if (!amountEl) continue;

		const nextText = String(amount);
		if (amountEl.textContent !== nextText) {
			amountEl.textContent = nextText;
		}
	}
}
