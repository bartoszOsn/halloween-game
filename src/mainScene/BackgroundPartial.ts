import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../screenDimensions';
import { inject } from '../util/Container';
import { LEVEL_TOKEN } from './levels/LevelToken';

export class BackgroundPartial {

	private readonly scene = inject(Phaser.Scene);
	private readonly level = inject(LEVEL_TOKEN);

	private readonly layersScrollFactor: Record<number, number> = {
		1: 0,
		2: 0.2 / 2,
		3: 0.3 / 2,
		4: 0.4 / 2,
		5: 0.5 / 2,
		6: 0.6 / 2,
		7: 0.7 / 2,
		8: 0.8 / 2,
		9: 1
	}

	load(): void {
		for(let i = 1; i <= 9; i++) {
			this.scene.load.image(`background${i}`, `/background/${i}.png`);
		}
		this.scene.load.audio('backgroundMusic', '/spooky_tune.mp3');
	}

	create() {
		for(const layer in this.layersScrollFactor) {
			const scrollFactor = this.layersScrollFactor[layer];
			this.createAligned(`background${layer}`, scrollFactor);
		}
		this.scene.sound.add('backgroundMusic', { loop: true }).play();
	}

	private createAligned(texture: string, scrollFactor: number) {
		const totalWidth = this.level.bounds.width + SCREEN_WIDTH / scrollFactor;
		const count = scrollFactor === 0 ? 1 : Math.ceil(totalWidth / SCREEN_WIDTH) * scrollFactor;

		let x = 0;
		for (let i = 0; i < count; ++i)
		{
			this.scene.add.image(x, 0, texture)
				.setDisplaySize(SCREEN_WIDTH, SCREEN_HEIGHT)
				.setOrigin(0, 0)
				.setScrollFactor(scrollFactor, 0)

			x += SCREEN_WIDTH;
		}
	}
}