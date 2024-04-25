import Phaser from 'phaser';
import { inject } from '../../util/Container.ts';
import { LEVEL_TOKEN } from '../levels/LevelToken.ts';
import { TileType } from './TileType.ts';
import { TILE_SCALE } from './TILE_SCALE.ts';
import { tileToWorld } from './tileToWorld.ts';

export class TilesPartial {
	private readonly scene = inject(Phaser.Scene);
	private readonly level = inject(LEVEL_TOKEN);
	public group: Phaser.Physics.Arcade.StaticGroup | null = null;

	load() {
		this.scene.load.image('platform', '/platform.png');
		for (const tileNumber of Object.values(TileType)) {
			this.scene.load.image(`tile-${tileNumber}`, `/tiles/Tiles/Tile (${tileNumber}).png`);
		}
	}

	create() {
		this.group = this.scene.physics.add.staticGroup();
		for (let tile of this.level.groundTiles) {
			const worldTile = tileToWorld(tile.x, tile.y);
			const tileObject: Phaser.Physics.Arcade.Sprite = this.group.create(
				worldTile.x,
				worldTile.y,
				this.getTileKey(tile.x, tile.y)
			);
			tileObject.setScale(TILE_SCALE).refreshBody();
		}
	}

	private getTileKey(x: number, y: number): string {
		const isTop = this.level.groundTiles.some(tile => tile.x === x && tile.y === y - 1) ? 'X' : 'O';
		const isRight = this.level.groundTiles.some(tile => tile.x === x + 1 && tile.y === y) ? 'X' : 'O';
		const isBottom = this.level.groundTiles.some(tile => tile.x === x && tile.y === y + 1) ? 'X' : 'O';
		const isLeft = this.level.groundTiles.some(tile => tile.x === x - 1 && tile.y === y) ? 'X' : 'O';

		const enumKey = `${isTop}${isRight}${isBottom}${isLeft}`;
		const value = TileType[enumKey as keyof typeof TileType];
		if (value === undefined) {
			throw new Error(`Tile not found for key: ${enumKey}`);
		}
		return `tile-${value}`;
	}
}