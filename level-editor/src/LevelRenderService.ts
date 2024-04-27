import { inject } from '../../src/util/Container.ts';
import { LevelRepository } from './LevelRepository.ts';
import { TILE_SCALE, TILE_SIZE } from '../../src/mainScene/tiles/TILE_SCALE.ts';
import { tileToWorld } from '../../src/mainScene/tiles/tileToWorld.ts';
import { Point } from '../../src/util/Point.ts';

export class LevelRenderService {
	private readonly scene = inject(Phaser.Scene);
	private readonly levelRepository = inject(LevelRepository);

	private readonly TILE_TEXTURE = 'tile';
	private readonly GRAVE_TEXTURE = 'grave';

	private startPositionMark: Phaser.GameObjects.Arc | null = null;
	private tiles: Set<Phaser.GameObjects.Image> = new Set();
	private graves: Set<Phaser.GameObjects.Image> = new Set();

	preload(): void {
		this.scene.load.image(this.TILE_TEXTURE, '/tiles/Tiles/Tile (5).png')
		this.scene.load.image(this.GRAVE_TEXTURE, '/tiles/Objects/TombStone (1).png')
	}

	create(): void {
		this.createStartPositionMark();

		this.levelRepository.on('startPositionChanged', () => this.renderStartPosition());
		this.levelRepository.on('tileAdded', (tile) => this.addTile(tile));
		this.levelRepository.on('tileRemoved', (tile) => this.removeTile(tile));
		this.levelRepository.on('zombieAdded', (zombie) => this.addGrave(zombie));
		this.levelRepository.on('zombieRemoved', (zombie) => this.removeGrave(zombie));
	}

	private createStartPositionMark(): void {
		this.startPositionMark = this.scene.add.arc(0, 0, TILE_SIZE / 2, 0, 360, false, 0xff00ff, 0.5);
		this.renderStartPosition();
	}

	private renderStartPosition(): void {
		const startPosition = this.levelRepository.get().startPosition;
		const { x, y } = tileToWorld(startPosition.x, startPosition.y);
		this.startPositionMark?.setPosition(x + TILE_SIZE / 2, y + TILE_SIZE / 2);
	}

	private addTile(tile: Point): void {
		const worldPosition = tileToWorld(tile.x, tile.y);
		const image = this.scene.add.image(worldPosition.x, worldPosition.y, this.TILE_TEXTURE)
			.setOrigin(0, 0)
			.setScale(TILE_SCALE, TILE_SCALE);

		this.tiles?.add(image);
	}

	private removeTile(tile: Point): void {
		const worldPosition = tileToWorld(tile.x, tile.y);
		Array.from(this.tiles).filter((image) => image.x === worldPosition.x && image.y === worldPosition.y).forEach((image) => {
			image.destroy();
			this.tiles.delete(image);
		});
	}

	private addGrave(grave: Point): void {
		const worldPosition = tileToWorld(grave.x, grave.y);
		const image = this.scene.add.image(worldPosition.x, worldPosition.y, this.GRAVE_TEXTURE)
			.setOrigin(0, 0)
			.setScale(0.5, 0.5);

		this.graves?.add(image);
	}

	private removeGrave(grave: Point): void {
		const worldPosition = tileToWorld(grave.x, grave.y);
		Array.from(this.graves).filter((image) => image.x === worldPosition.x && image.y === worldPosition.y).forEach((image) => {
			image.destroy();
			this.graves.delete(image);
		});
	}
}