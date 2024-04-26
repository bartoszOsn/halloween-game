import Phaser from 'phaser';
import { BackgroundPartial } from './BackgroundPartial';
import { levels } from './levels/levels';
import { TilesPartial } from './tiles/TilesPartial.ts';
import { PlayerPartial } from './player/PlayerPartial';
import { injectForward } from '../util/Container';
import { ZombieService } from './ZombieService';
import { TILE_SIZE } from './tiles/TILE_SCALE.ts';
import { Level } from './levels/Level.ts';

export class MainScene extends Phaser.Scene {
	private readonly backgroundPartial = injectForward(BackgroundPartial);
	private readonly platformsPartial = injectForward(TilesPartial);
	private readonly playerPartial = injectForward(PlayerPartial);
	private readonly zombieService = injectForward(ZombieService);

	constructor(private readonly level: Level = levels[0]) {
		super('main scene');
	}

	preload(): void {
		this.backgroundPartial.value.load();
		this.platformsPartial.value.load();
		this.playerPartial.value.load();
		this.zombieService.value.load();
		this.zombieService.value.load();
	}

	create(): void {
		this.backgroundPartial.value.create();
		this.platformsPartial.value.create();
		this.playerPartial.value.create();
		this.zombieService.value.create();

		this.physics.world.setBounds(
			0,
			0,
			this.level.sizeInTiles.width * TILE_SIZE,
			this.level.sizeInTiles.height * TILE_SIZE
		);

		this.cameras.main.setBounds(
			0,
			0,
			this.level.sizeInTiles.width * TILE_SIZE,
			this.level.sizeInTiles.height * TILE_SIZE
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

		if (this.input.activePointer.isDown) {
			console.log(this.input.activePointer.positionToCamera(this.cameras.main));
		}
	}
}