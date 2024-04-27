import { Tool } from './Tool.ts';
import { LevelRepository } from '../LevelRepository.ts';
import { inject } from '../../../src/util/Container.ts';
import { worldToTile } from '../../../src/mainScene/tiles/tileToWorld.ts';

export class ZombieTool extends Tool {
	private readonly scene = inject(Phaser.Scene);
	private readonly levelRepository = inject(LevelRepository);

    get id(): string { return 'zombie'; }
    get name(): string { return "Zombies"; }
    get icon(): string { return '🧟'; }
    activate(): void {}
    deactivate(): void {}

    update(): void {
		if (!this.scene.input.manager.isOver) return;

		const tilePos = worldToTile(this.scene.input.activePointer.worldX, this.scene.input.activePointer.worldY);
		if (this.scene.input.activePointer.leftButtonDown()) {
			this.levelRepository.addZombie(tilePos);
		} else if (this.scene.input.activePointer.rightButtonDown()) {
			this.levelRepository.removeZombie(tilePos);
		}
    }

}