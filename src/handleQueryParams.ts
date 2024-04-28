import { Level } from './mainScene/levels/Level.ts';
import { LEVEL_STORAGE_KEY } from './LEVEL_STORAGE_KEY.ts';

export async function handleQueryParams(): Promise<QueryParams> {
	const urlSearchParams = new URLSearchParams(window.location.search);
	const queryParams: QueryParams = {};

	if (urlSearchParams.has('debug')) {
		queryParams.debug = true;
	}

	if (urlSearchParams.has('level')) {
		const levelRaw = localStorage	.getItem(LEVEL_STORAGE_KEY);
		if (levelRaw) {
			const level: Level = JSON.parse(levelRaw);
			queryParams.level = level;
		}
	}

	return queryParams;
}

export interface QueryParams {
	level?: Level;
	debug?: boolean;
}