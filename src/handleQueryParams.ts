import { Level } from './mainScene/levels/Level.ts';
import { LEVEL_STORAGE_KEY } from './LEVEL_STORAGE_KEY.ts';

export function handleQueryParams(): QueryParams {
	let level: Level | undefined;
	let debug: boolean | undefined;

	const urlSearchParams = new URLSearchParams(window.location.search);

	if (urlSearchParams.has('debug')) {
		debug = true;
	}

	if (urlSearchParams.has('level')) {
		const levelRaw = localStorage	.getItem(LEVEL_STORAGE_KEY);
		if (levelRaw) {
			level = JSON.parse(levelRaw);
		}
	}

	return new QueryParams(level, debug);
}

export class QueryParams {
	constructor(
		public readonly level?: Level,
		public readonly debug?: boolean
	) {
	}
}
