import { Tool } from './Tool.ts';
import { inject } from '../../util/Container.ts';
import { LevelRepository } from '../LevelRepository.ts';
import { Point } from '../../util/Point.ts';
import { tileToWorld, worldToTile } from '../../mainScene/tiles/tileToWorld.ts';
import { DepthLayer } from '../../DepthLayer.ts';

export class GarlicWallTool extends Tool {
	private readonly scene = inject(Phaser.Scene);
	private readonly levelRepository = inject(LevelRepository);

    get id(): string { return 'garlic-wall'; }
    get name(): string { return 'Garlic Wall';}
    get icon(): string { return '🧄'; }

	private startDragPoint: Point | null = null;
	private marker: Phaser.GameObjects.Rectangle | null = null;

    activate(): void {}
    deactivate(): void {}

    update(): void {
		if (!this.scene.input.manager.isOver) return;

		if (this.scene.input.activePointer.rightButtonDown()) {
			const tilePosition = worldToTile(this.scene.input.activePointer.worldX, this.scene.input.activePointer.worldY);
			this.levelRepository.removeGarlicWall(tilePosition);
		}

		if (!this.startDragPoint && this.scene.input.activePointer.leftButtonDown()) {
			this.startDrag();
		}

		if (this.startDragPoint) {
			this.updateDrag();
		}
    }

	startDrag(): void {
		this.startDragPoint = worldToTile(this.scene.input.activePointer.worldX, this.scene.input.activePointer.worldY);

		this.marker = this.scene
			.add.rectangle(0, 0, 0, 0,  0x00ff00, 0.5)
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

		if (!this.scene.input.activePointer.leftButtonDown()) {
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
		const length = x2 - x1 + 1;

		this.levelRepository.addGarlicWall({ x: x1, y: y1 }, length);

		this.startDragPoint = null;
		this.marker?.destroy();
		this.marker = null;
	}

}