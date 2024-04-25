import { inject } from '../../src/util/Container.ts';
import { TILE_SIZE } from '../../src/mainScene/tiles/TILE_SCALE.ts';
import { tileToWorld, worldToTile } from '../../src/mainScene/tiles/tileToWorld.ts';
import { ToolbarInfoService } from './toolbar/ToolbarInfoService.ts';

export class CursorService {
	private readonly scene = inject(Phaser.Scene);
	private readonly toolbarInfoService = inject(ToolbarInfoService);

	private rect: Phaser.GameObjects.Rectangle | null = null;

	create(): void {
		this.rect = this.scene.add.rectangle(0, 0, TILE_SIZE, TILE_SIZE, 0xAAFFFF);
		this.rect.setAlpha(0.5);
	}

	update(): void {
		if (this.rect === null) {
			return;
		}

		const pointer = this.scene.input.activePointer;

		const rawWorldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);

		const tilePos = worldToTile(rawWorldPoint.x, rawWorldPoint.y);
		const worldPos = tileToWorld(tilePos.x, tilePos.y);

		this.rect.setPosition(worldPos.x, worldPos.y);
		this.toolbarInfoService.setPosition(tilePos);
	}
}