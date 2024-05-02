import { handleQueryParams, QueryParams } from './handleQueryParams.ts';
import Phaser from 'phaser';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './screenDimensions.ts';
import { Container } from './util/Container.ts';
import { GameManager } from './GameManager.ts';

export function bootstrap() {
	const queryParams = handleQueryParams();

	const game = new Phaser.Game({
		type: Phaser.AUTO,
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		physics: {
			default: 'arcade',
			arcade: {
				debug: queryParams.debug === true,
				timeScale: 0.9,

			}
		},
		render: {
			pixelArt: true,
			transparent: false
		},
		disableContextMenu: true,
		loader: {
			baseURL: import.meta.env.MODE === 'development' ? '' : 'https://bartoszosn.github.io/halloween-game/' // TODO use env variable
		}
	});

	const container = Container.create()
		.withValue(Phaser.Game, game)
		.withValue(QueryParams, queryParams)
		.withClass(GameManager, GameManager);

	const gameManager = container.get(GameManager);
	gameManager.init();
}