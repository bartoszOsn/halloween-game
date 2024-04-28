import { inject } from '../../src/util/Container.ts';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../src/screenDimensions.ts';

export class BackgroundService {
	private readonly scene = inject(Phaser.Scene);
	private readonly images: Phaser.GameObjects.Image[] = [];

	private readonly BG_COUNT = 4;

	public preload(): void {
		for (let i = 1; i <= this.BG_COUNT; i++) {
			this.scene.load.image(`background${i}`, `/background/${i}.png`);
		}
	}

	public create(): void {
		for (let i = 1; i <= this.BG_COUNT; i++) {
			this.images.push(
				this.scene.add.image(0, 0, `background${i}`)
					.setDisplaySize(SCREEN_WIDTH, SCREEN_HEIGHT)
					.setOrigin(0, 0)
			)
		}
	}

	public setSize(width: number, height: number): void {
		for (const image of this.images) {
			image.setDisplaySize(width, height);
		}
	}
}