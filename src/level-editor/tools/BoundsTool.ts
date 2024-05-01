import { Tool } from './Tool.ts';
import { inject } from '../../../src/util/Container.ts';
import { LevelRepository } from '../LevelRepository.ts';
import { tileToWorld, worldToTile } from '../../../src/mainScene/tiles/tileToWorld.ts';
import { TILE_SIZE } from '../../../src/mainScene/tiles/TILE_SCALE.ts';
import { DepthLayer } from '../../DepthLayer.ts';

export class BoundsTool extends Tool {
	private readonly scene = inject(Phaser.Scene);
	private readonly levelRepository = inject(LevelRepository);

	private readonly HANDLE_SIZE = 8;
	private readonly CURSOR_HOVER = 'grab';
	private readonly CURSOR_DRAG = 'grabbing';

	private handle: Phaser.GameObjects.Rectangle | null = null;
	private isDragging = false;

	get id(): string { return 'bounds'; }
    get name(): string { return 'Bounds'; }
    get icon(): string { return '🔲'; }

	constructor() {
		super();

		this.handlePointerDown = this.handlePointerDown.bind(this);
		this.handlePointerUp = this.handlePointerUp.bind(this);
	}

    activate(): void {
		this.handle = this.scene.add.rectangle(0, 0, this.HANDLE_SIZE, this.HANDLE_SIZE, 0xff0000)
			.setInteractive({ cursor: this.CURSOR_HOVER })
			.setDepth(DepthLayer.UI);
		this.positionHandle();
		this.handle.on('pointerdown', this.handlePointerDown);
    }

    deactivate(): void {
		this.handle?.off('pointerdown', this.handlePointerDown);
		this.scene.input.off('pointerup', this.handlePointerUp);
		this.handle?.destroy();
		this.handle = null;
    }

    update(): void {
		this.handleZoom();

		if (this.isDragging) {
			const pointer = this.scene.input.activePointer;

			const newSize = worldToTile(pointer.worldX + TILE_SIZE / 2, pointer.worldY + TILE_SIZE / 2);
			this.levelRepository.setSizeInTiles({ width: newSize.x, height: newSize.y });

			this.positionHandle();
		}
    }

	private positionHandle(): void {
		const level = this.levelRepository.get();
		const size = level.sizeInTiles;
		const worldSize = tileToWorld(size.width, size.height);

		this.handle?.setPosition(worldSize.x, worldSize.y);
	}

	private handleZoom(): void {
		const zoom = this.scene.cameras.main.zoom;

		this.handle?.setScale(1 / zoom);
	}

	private handlePointerDown(): void {
		this.isDragging = true;
		this.handle?.setInteractive({ cursor: this.CURSOR_DRAG });
		this.scene.input.manager.setDefaultCursor(this.CURSOR_DRAG);
		this.scene.input.on('pointerup', this.handlePointerUp);
	}

	private handlePointerUp(): void {
		this.isDragging = false;
		this.handle?.setInteractive({ cursor: this.CURSOR_HOVER });
		this.scene.input.manager.setDefaultCursor('auto');
		this.scene.input.off('pointerup', this.handlePointerUp);
	}
}