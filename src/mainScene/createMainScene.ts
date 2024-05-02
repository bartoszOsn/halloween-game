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
import { SignService } from './SignService.ts';
import { ExitGateService } from './ExitGateService.ts';
import { HealthService } from './HealthService.ts';
import { GarlicWallService } from './GarlicWallService.ts';
import { CameraService } from './CameraService.ts';

export function createMainScene(parentContainer: Container, level: Level): Phaser.Scene {
	const container = parentContainer.child()
		.withValue(LEVEL_TOKEN, level)
		.withClass(Phaser.Scene, MainScene)
		.withClass(BackgroundPartial, BackgroundPartial)
		.withClass(TilesPartial, TilesPartial)
		.withClass(PlayerPartial, PlayerPartial)
		.withClass(ZombieService, ZombieService)
		.withClass(PlayerStateService, PlayerStateService)
		.withClass(SignService, SignService)
		.withClass(ExitGateService, ExitGateService)
		.withClass(HealthService, HealthService)
		.withClass(GarlicWallService, GarlicWallService)
		.withClass(CameraService, CameraService);

	return container.get(Phaser.Scene);
}