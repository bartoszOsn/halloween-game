import { inject } from '../util/Container.ts';
import { PlayerPartial } from './player/PlayerPartial.ts';
import { LEVEL_TOKEN } from './levels/LevelToken.ts';
import { TILE_SIZE } from './tiles/TILE_SCALE.ts';
import { SCREEN_HEIGHT } from '../screenDimensions.ts';

export 	class CameraService {
	private readonly scene = inject(Phaser.Scene);
	private readonly playerPartial = inject(PlayerPartial);
	private readonly level = inject(LEVEL_TOKEN);

	private readonly Y_DIVISOR = 32;
	private readonly OFFSET_Y = -SCREEN_HEIGHT / 6;

	private targetY: number = 0;
	private cameraY: number = 0;

	create() {
		this.scene.cameras.main.setBounds(
			0,
			0,
			this.level.sizeInTiles.width * TILE_SIZE,
			this.level.sizeInTiles.height * TILE_SIZE
		);

		// this.scene.cameras.main.startFollow(this.playerPartial.playerImage!, false, 1, 1, 0, SCREEN_HEIGHT / 6);
		this.targetY = this.playerPartial.playerImage!.getCenter().y ?? this.targetY;
		this.cameraY = this.targetY;
		this.scene.cameras.main.centerOnY(this.cameraY);

		this.scene.renderer.on('prerender', () => this.update());
	}

	update() {
		const playerY = this.playerPartial.playerImage?.getCenter().y ?? this.targetY;
		if (this.playerPartial.playerImage?.body?.touching.down) {
			this.targetY = playerY;
		}

		const offsetY = this.targetY - this.cameraY;
		let newCameraY = this.cameraY + offsetY / this.Y_DIVISOR;

		// TODO CLAMP OFFSET SO THAT PLAYER IS ALWAYS IN THE FRAME

		this.scene.cameras.main.centerOn(this.playerPartial.playerImage?.getCenter().x ?? 0, newCameraY + this.OFFSET_Y);
		this.cameraY = newCameraY;
	}
}