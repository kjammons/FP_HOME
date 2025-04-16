import { writable } from 'svelte/store';

export const selectedCity = writable("");
export const cityList = writable([]);
export const geoDataStore = writable(null);
