import { inject } from '../../src/util/Container.ts';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../src/screenDimensions.ts';

export class BackgroundService {
	private readonly scene = inject(Phaser.Scene);

	private readonly BG_COUNT = 9;

	public preload(): void {
		for (let i = 1; i <= this.BG_COUNT; i++) {
			this.scene.load.image(`background${i}`, `/background/${i}.png`);
		}
	}

	public create(): void {
		for (let i = 1; i <= this.BG_COUNT; i++) {
			this.scene.add.image(0, 0, `background${i}`)
				.setDisplaySize(SCREEN_WIDTH, SCREEN_HEIGHT)
				.setOrigin(0, 0)
				.setScrollFactor(1, 1);
		}
	}
}