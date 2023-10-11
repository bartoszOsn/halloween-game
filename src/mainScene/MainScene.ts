import Phaser from 'phaser';
import { BackgroundPartial } from './BackgroundPartial';
import { levels } from './levels/levels';
import { PlatformsPartial } from './PlatformsPartial';
import { PlayerPartial } from './player/PlayerPartial';
import { Container } from '../util/Container';
import { LEVEL_TOKEN } from './levels/LevelToken';
import { ZombieService } from './ZombieService';
import { PlayerStateService } from './player/PlayerStateService';

export class MainScene extends Phaser.Scene {
	private readonly level = levels[0];

	private readonly container = new Container()
		.withValue(LEVEL_TOKEN, this.level)
		.withValue(Phaser.Scene, this)
		.withClass(BackgroundPartial, BackgroundPartial)
		.withClass(PlatformsPartial, PlatformsPartial)
		.withClass(PlayerPartial, PlayerPartial)
		.withClass(ZombieService, ZombieService)
		.withClass(PlayerStateService, PlayerStateService);

	private readonly backgroundPartial = this.container.get(BackgroundPartial);
	private readonly platformsPartial = this.container.get(PlatformsPartial);
	private readonly playerPartial = this.container.get(PlayerPartial);
	private readonly zombieService = this.container.get(ZombieService);

	constructor() {
		super('main scene');
	}

	preload(): void {
		this.backgroundPartial.load();
		this.platformsPartial.load();
		this.playerPartial.load();
		this.zombieService.load();
		this.zombieService.load();
	}

	create(): void {
		this.backgroundPartial.create();
		this.platformsPartial.create();
		this.playerPartial.create();
		this.zombieService.create();

		this.physics.world.setBounds(
			this.level.bounds.left,
			this.level.bounds.top,
			this.level.bounds.width,
			this.level.bounds.height
		);

		this.cameras.main.setBounds(
			this.level.bounds.left,
			this.level.bounds.top,
			this.level.bounds.width,
			this.level.bounds.height
		);

		if (!this.playerPartial.playerImage || !this.platformsPartial.group) {
			throw new Error('Player or platforms not initialized');
		}
		this.physics.add.collider(
			this.playerPartial.playerImage,
			this.platformsPartial.group,
			() => {
				if (this.playerPartial.playerImage?.body?.touching.down) {
					this.playerPartial.onCollisionWithGround();
				}

			}
		);
	}

	update(): void {
		this.playerPartial.update();
		this.zombieService.update();

		if (this.input.activePointer.isDown) {
			console.log(this.input.activePointer.positionToCamera(this.cameras.main));
		}
	}
}