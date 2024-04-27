import { MainScene } from './MainScene.ts';
import { Container } from '../util/Container.ts';
import { LEVEL_TOKEN } from './levels/LevelToken.ts';
import Phaser from 'phaser';
import { BackgroundPartial } from './BackgroundPartial.ts';
import { TilesPartial } from './tiles/TilesPartial.ts';
import { PlayerPartial } from './player/PlayerPartial.ts';
import { ZombieService } from './ZombieService.ts';
import { PlayerStateService } from './player/PlayerStateService.ts';
import { Level } from './levels/Level.ts';
import { levels } from './levels/levels.ts';

export function createMainScene(): Phaser.Scene {
	const query = new URLSearchParams(window.location.search);

	let level: Level = levels[0];

	if (query.has('level')) {
		const levelBase64 = query.get('level')!;
		const jsonLevel = atob(levelBase64);
		level = JSON.parse(jsonLevel);
	}


	const container = new Container()
		.withValue(LEVEL_TOKEN, level)
		.withClass(Phaser.Scene, MainScene)
		.withClass(BackgroundPartial, BackgroundPartial)
		.withClass(TilesPartial, TilesPartial)
		.withClass(PlayerPartial, PlayerPartial)
		.withClass(ZombieService, ZombieService)
		.withClass(PlayerStateService, PlayerStateService);

	return container.get(Phaser.Scene);
}