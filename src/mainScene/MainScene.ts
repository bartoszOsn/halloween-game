import Phaser from 'phaser';
import { BackgroundPartial } from './BackgroundPartial';
import { TilesPartial } from './tiles/TilesPartial.ts';
import { PlayerPartial } from './player/PlayerPartial';
import { injectForward } from '../util/Container';
import { ZombieService } from './ZombieService';
import { TILE_SIZE } from './tiles/TILE_SCALE.ts';
import { LEVEL_TOKEN } from './levels/LevelToken.ts';
import { SCREEN_HEIGHT } from '../screenDimensions.ts';
import { SignService } from './SignService.ts';
import { ExitGateService } from './ExitGateService.ts';
import { HealthService } from './HealthService.ts';
import { GarlicWallService } from './GarlicWallService.ts';
import { CameraService } from './CameraService.ts';

export class MainScene extends Phaser.Scene {
	private readonly level = injectForward(LEVEL_TOKEN);
	private readonly backgroundPartial = injectForward(BackgroundPartial);
	private readonly platformsPartial = injectForward(TilesPartial);
	private readonly playerPartial = injectForward(PlayerPartial);
	private readonly zombieService = injectForward(ZombieService);
	private readonly signService = injectForward(SignService);
	private readonly exitGateService  = injectForward(ExitGateService);
	private readonly healthService = injectForward(HealthService);
	private readonly garlicWallService = injectForward(GarlicWallService);
	private readonly cameraService = injectForward(CameraService);

	constructor() {
		super('main scene');
	}

	preload(): void {
		this.backgroundPartial.value.load();
		this.platformsPartial.value.load();
		this.playerPartial.value.load();
		this.zombieService.value.load();
		this.zombieService.value.load();
		this.signService.value.preload();
		this.exitGateService.value.preload();
		this.healthService.value.preload();
		this.garlicWallService.value.preload();
	}

	create(): void {
		this.backgroundPartial.value.create();
		this.platformsPartial.value.create();
		this.signService.value.create();
		this.playerPartial.value.create();
		this.zombieService.value.create();
		this.exitGateService.value.create();
		this.healthService.value.create();
		this.cameraService.value.create();

		this.physics.world.setBounds(
			0,
			0,
			this.level.value.sizeInTiles.width * TILE_SIZE,
			this.level.value.sizeInTiles.height * TILE_SIZE + SCREEN_HEIGHT
		);

		if (!this.playerPartial.value.playerImage || !this.platformsPartial.value.group) {
			throw new Error('Player or platforms not initialized');
		}
		this.physics.add.collider(
			this.playerPartial.value.playerImage,
			this.platformsPartial.value.group,
			() => {
				if (this.playerPartial.value.playerImage?.body?.touching.down) {
					this.playerPartial.value.onCollisionWithGround();
				}

			}
		);
	}

	update(): void {
		this.playerPartial.value.update();
		this.zombieService.value.update();
		this.signService.value.update();
		this.exitGateService.value.update();
		this.garlicWallService.value.update();
	}
}