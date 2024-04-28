import { Level } from './mainScene/levels/Level.ts';
import { LevelMessagePayload, LevelRequestedMessage } from './LevelMessagePayload.ts';

export async function handleQueryParams(): Promise<QueryParams> {
	const urlSearchParams = new URLSearchParams(window.location.search);
	const queryParams: QueryParams = {};

	if (urlSearchParams.has('debug')) {
		queryParams.debug = true;
	}

	if (urlSearchParams.has('level')) {
		// const levelBase64 = urlSearchParams.get('level')!;
		// const jsonLevel = atob(levelBase64);
		// queryParams.level = JSON.parse(jsonLevel);

		await new Promise<void>(resolve => {
			const handler = (event: MessageEvent<LevelMessagePayload>) => {
				if (event.data.type === 'levelSent') {
					queryParams.level = event.data.level;
					window.removeEventListener('message', handler);
					resolve();
				}
			};

			window.addEventListener('message', handler);
			window.opener?.postMessage({ type: 'levelRequested' } satisfies LevelRequestedMessage, '*');
		});
	}

	return queryParams;
}

export interface QueryParams {
	level?: Level;
	debug?: boolean;
}