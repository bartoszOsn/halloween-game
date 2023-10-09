import Phaser from 'phaser';
import { BackgroundPartial } from './BackgroundPartial';
import { levels } from './levels/levels';
import { PlatformsPartial } from './PlatformsPartial';
import { PlayerPartial } from './PlayerPartial';

export class MainScene extends Phaser.Scene {
	private readonly level = levels[0];
	private readonly backgroundPartial: BackgroundPartial = new BackgroundPartial(this, this.level);
	private readonly platformsPartial: PlatformsPartial = new PlatformsPartial(this, this.level);
	private readonly playerPartial: PlayerPartial = new PlayerPartial(this, this.level);

	constructor() {
		super('main scene');
	}

	preload(): void {
		this.backgroundPartial.load();
		this.platformsPartial.load();
		this.playerPartial.load();
	}

	create(): void {
		this.backgroundPartial.create();
		this.platformsPartial.create();
		this.playerPartial.create();

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

		if (this.input.activePointer.isDown) {
			console.log(this.input.activePointer.positionToCamera(this.cameras.main));
		}
	}
}