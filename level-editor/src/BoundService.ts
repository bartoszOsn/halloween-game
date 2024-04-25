import Phaser from 'phaser';
import { inject } from '../../src/util/Container.ts';
import { LevelRepository } from './LevelRepository.ts';
import { tileToWorld } from '../../src/mainScene/tiles/tileToWorld.ts';
import { Size } from '../../src/util/Size.ts';
import { BackgroundService } from './BackgroundService.ts';

export class BoundService {
	private readonly scene = inject(Phaser.Scene);
	private readonly backgroundService = inject(BackgroundService);
	private readonly levelRepository = inject(LevelRepository);

	preload(): void {
		this.backgroundService.preload();
	}

	create() {
		const rect = this.scene.add.rectangle(400, 300, 200, 200, 0x00ff00, 0);
		rect.setOrigin(0, 0);
		rect.setStrokeStyle(2, 0xff0000);

		const level = this.levelRepository.get();
		rect.setPosition(0, 0);
		const worldSize = tileToWorld(level.sizeInTiles.width, level.sizeInTiles.height);
		rect.setSize(worldSize.x, worldSize.y);

		this.backgroundService.create();
		this.backgroundService.setSize(worldSize.x, worldSize.y);

		this.levelRepository.on('sizeInTilesChanged', (sizeInTiles: Size) => {
			const worldSize = tileToWorld(sizeInTiles.width, sizeInTiles.height);
			rect.setSize(worldSize.x, worldSize.y);
			this.backgroundService.setSize(worldSize.x, worldSize.y);
		})
	}
}