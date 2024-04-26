import { Tool } from './Tool.ts';
import { inject } from '../../../src/util/Container.ts';
import { worldToTile } from '../../../src/mainScene/tiles/tileToWorld.ts';
import { LevelRepository } from '../LevelRepository.ts';

export class StartPositionTool extends Tool {
	private readonly scene = inject(Phaser.Scene);
	private readonly levelRepository = inject(LevelRepository);

    get id(): string { return 'start-position' }
    get name(): string { return 'Set start position' }
    get icon(): string { return '✖️'; }

    activate(): void {
    }
    deactivate(): void {
    }
    update(): void {
        if (this.scene.input.activePointer.leftButtonDown()) {
			const x = this.scene.input.activePointer.worldX;
			const y = this.scene.input.activePointer.worldY;

			const tilePos = worldToTile(x, y);
			this.levelRepository.setStartPosition(tilePos);
		}
    }

}