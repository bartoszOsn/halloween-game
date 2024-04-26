import { inject } from '../../src/util/Container.ts';
import { LevelRepository } from './LevelRepository.ts';
import { TILE_SIZE } from '../../src/mainScene/tiles/TILE_SCALE.ts';
import { tileToWorld } from '../../src/mainScene/tiles/tileToWorld.ts';

export class LevelRenderService {
	private readonly scene = inject(Phaser.Scene);
	private readonly levelRepository = inject(LevelRepository);

	private startPositionMark: Phaser.GameObjects.Arc | null = null;


	create(): void {
		this.createStartPositionMark();

		this.levelRepository.on('startPositionChanged', this.renderStartPosition.bind(this));
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
}