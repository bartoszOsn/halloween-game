import { Tool } from './Tool.ts';
import { inject } from '../../util/Container.ts';
import { Point } from '../../util/Point.ts';
import { tileToWorld, worldToTile } from '../../mainScene/tiles/tileToWorld.ts';
import { LevelRepository } from '../LevelRepository.ts';
import { DepthLayer } from '../../DepthLayer.ts';

export class TileAreaTool extends Tool {
	private readonly scene = inject(Phaser.Scene);
	private readonly levelRepository = inject(LevelRepository);

    get id(): string { return 'tile-area';}
    get name(): string { return 'Tile Area'; }
    get icon(): string { return '🧩'; }

	private startDragPoint: Point | null = null;
	private marker: Phaser.GameObjects.Rectangle | null = null;
	private operation: 'add' | 'remove' | null = null;

    activate(): void {}
    deactivate(): void {}

    update(): void {
		if (!this.scene.input.manager.isOver) return;

        if (!this.startDragPoint && !this.scene.input.activePointer.noButtonDown()) {
			this.startDrag();
		}

		if (this.startDragPoint) {
			this.updateDrag();
		}
    }

	startDrag(): void {
		if (this.scene.input.activePointer.leftButtonDown()) {
			this.operation = 'add';
		} else if (this.scene.input.activePointer.rightButtonDown()) {
			this.operation = 'remove';
		} else {
			return;
		}

		this.startDragPoint = worldToTile(this.scene.input.activePointer.worldX, this.scene.input.activePointer.worldY);

		const color = this.operation === 'add' ? 0x00ff00 : 0xff0000;

		this.marker = this.scene
			.add.rectangle(0, 0, 0, 0,  color, 0.5)
			.setOrigin(0, 0)
			.setDepth(DepthLayer.UI);
	}

	updateDrag(): void {
		if (!this.startDragPoint) {
			return;
		}

		const endDragPoint = worldToTile(this.scene.input.activePointer.worldX, this.scene.input.activePointer.worldY);

		const width = endDragPoint.x - this.startDragPoint.x + 1;
		const height = endDragPoint.y - this.startDragPoint.y + 1;

		const sizeWorld = tileToWorld(width, height);
		const posWorld = tileToWorld(this.startDragPoint.x, this.startDragPoint.y);

		this.marker?.setPosition(posWorld.x, posWorld.y);
		this.marker?.setSize(sizeWorld.x, sizeWorld.y);

		const addEnd = this.operation === 'add' && !this.scene.input.activePointer.leftButtonDown();
		const removeEnd = this.operation === 'remove' && !this.scene.input.activePointer.rightButtonDown();

		if (addEnd || removeEnd) {
			this.endDrag(endDragPoint);
		}
	}

	endDrag(endDragPoint: Point): void {
		if (!this.startDragPoint) {
			return
		}

		const x1 = Math.min(this.startDragPoint.x, endDragPoint.x);
		const y1 = Math.min(this.startDragPoint.y, endDragPoint.y);
		const x2 = Math.max(this.startDragPoint.x, endDragPoint.x);
		const y2 = Math.max(this.startDragPoint.y, endDragPoint.y);

		for (let y = y1; y <= y2; y++) {
			for (let x = x1; x <= x2; x++) {
				if (this.operation === 'add') {
					this.levelRepository.addTile({x, y});
				} else if (this.operation === 'remove') {
					this.levelRepository.removeTile({x, y});
				}
			}
		}

		this.startDragPoint = null;
		this.marker?.destroy();
		this.marker = null;
		this.operation = null;
	}

}