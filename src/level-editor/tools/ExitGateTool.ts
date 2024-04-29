import { Tool } from './Tool.ts';
import { inject } from '../../util/Container.ts';
import { LevelRepository } from '../LevelRepository.ts';
import { worldToTile } from '../../mainScene/tiles/tileToWorld.ts';

export class ExitGateTool extends Tool {
	private readonly scene = inject(Phaser.Scene);
	private readonly levelRepository = inject(LevelRepository);

    get id(): string { return 'exit-gate'; }
    get name(): string { return 'Exit Gate'; }
    get icon(): string { return '🚪'; }

	constructor() {
		super();
		this.handlePointerDown = this.handlePointerDown.bind(this);
	}

    activate(): void {
        this.scene.input.on('pointerdown', this.handlePointerDown);
    }
    deactivate(): void {
        throw new Error('Method not implemented.');
    }
    update(): void {}

	handlePointerDown(pointer: Phaser.Input.Pointer): void {
		const level = this.levelRepository.get();
		const pos = worldToTile(pointer.worldX, pointer.worldY);
		if (pointer.leftButtonDown()) {
			this.levelRepository.setExitGatePosition(pos);
		} else if (pointer.rightButtonDown()) {
			if (level.exitGate.triggerPosition?.x === pos.x && level.exitGate.triggerPosition?.y === pos.y) {
				this.levelRepository.removeExitGateTrigger();
			} else {
				this.levelRepository.setExitGateTriggerPosition(pos);
			}
		}
	}
}