import Phaser from 'phaser';
import { inject } from '../util/Container';
import { LEVEL_TOKEN } from './levels/LevelToken';

export class PlatformsPartial {
	private readonly scene = inject(Phaser.Scene);
	private readonly level = inject(LEVEL_TOKEN);
	public group: Phaser.Physics.Arcade.StaticGroup | null = null;

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