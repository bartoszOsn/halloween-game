import Phaser from 'phaser';
import { Level } from './levels/Level';

export class PlatformsPartial {
	public group: Phaser.Physics.Arcade.StaticGroup | null = null;

	constructor(
		private readonly scene: Phaser.Scene,
		private readonly level: Level
	) {
	}

	load() {
		this.scene.load.image('platform', '/platform.png');
	}

	create() {
		this.group = this.scene.physics.add.staticGroup();
		for (let platform of this.level.platforms) {
			const platformObject: Phaser.Physics.Arcade.Sprite = this.group.create(platform.x, platform.y, 'platform');
			platformObject.setScale(0.5).refreshBody();
		}
	}
}