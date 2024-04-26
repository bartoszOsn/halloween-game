import { Tool } from './Tool.ts';
import { inject } from '../../../src/util/Container.ts';
import { LevelRepository } from '../LevelRepository.ts';
import { worldToTile } from '../../../src/mainScene/tiles/tileToWorld.ts';

export class TileTool extends Tool {
	private readonly scene = inject(Phaser.Scene);
	private readonly levelRepository = inject(LevelRepository);

    get id(): string { return 'tile'; }
    get name(): string { return 'Tile'; }
    get icon(): string { return '🧩'; }

    activate(): void {}
    deactivate(): void {}

    update(): void {
		const tilePos = worldToTile(this.scene.input.activePointer.worldX, this.scene.input.activePointer.worldY);
        if (this.scene.input.activePointer.leftButtonDown()) {
			this.levelRepository.addTile(tilePos);
		} else if (this.scene.input.activePointer.rightButtonDown()) {
			this.levelRepository.removeTile(tilePos);
		}
    }

}