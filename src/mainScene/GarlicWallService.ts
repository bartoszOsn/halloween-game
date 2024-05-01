import { inject } from '../util/Container.ts';
import { LEVEL_TOKEN } from './levels/LevelToken.ts';
import { Level } from './levels/Level.ts';
import { tileToWorld } from './tiles/tileToWorld.ts';
import { TilesPartial } from './tiles/TilesPartial.ts';
import { PlayerPartial } from './player/PlayerPartial.ts';
import { DepthLayer } from '../DepthLayer.ts';

export class GarlicWallService {
	private readonly scene = inject(Phaser.Scene);
	private readonly level = inject(LEVEL_TOKEN);
	private readonly tilesPartial = inject(TilesPartial);
	private readonly playerPartial = inject(PlayerPartial);

	private readonly GARLIC_TEXTURE = 'garlic';
	private readonly SPAWN_RATE = 0.001;

	preload(): void {
		this.scene.load.image(this.GARLIC_TEXTURE, '/garlic.png');
	}

	update(): void {
		for (let garlicWall of this.level.garlicWalls) {
			if (Math.random() < this.SPAWN_RATE * garlicWall.length) {
				this.spawnGarlic(garlicWall);
			}
		}
	}

	spawnGarlic(garlicWall: Level['garlicWalls'][number]): void {
		const x = garlicWall.position.x + Math.random() * garlicWall.length;
		const y = garlicWall.position.y - 0.5;

		const worldPos = tileToWorld(x, y);

		const garlic = this.scene.physics.add.image(worldPos.x, worldPos.y, this.GARLIC_TEXTURE)
			.setScale(0.25)
			.setGravityY(300)
			.setDepth(DepthLayer.ENTITIES);

		this.scene.physics.add.collider(
			garlic,
			this.tilesPartial.group!,
			() => garlic.destroy()
		);

		this.scene.physics.add.overlap(
			garlic,
			this.playerPartial.playerImage!,
			() => {
				this.playerPartial.hurtFrom(garlic.getCenter());
				garlic.destroy();
			}
		);
	}
}