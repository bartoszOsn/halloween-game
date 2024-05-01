import { inject } from '../util/Container.ts';
import { SCREEN_WIDTH } from '../screenDimensions.ts';
import { GameManager } from '../GameManager.ts';
import { DepthLayer } from '../DepthLayer.ts';

export class HealthService {
	private readonly INITIAL_HEALTH = 3;
	private readonly BLOOD_FLASK_TEXTURE = 'blood-flask';
	private readonly EMPTY_BLOOD_FLASK_TEXTURE = 'empty-blood-flask';

	private readonly scene = inject(Phaser.Scene);
	private readonly gameManager = inject(GameManager);

	private readonly healthFlasks: Phaser.GameObjects.Image[] = [];

	private health = this.INITIAL_HEALTH;

	preload(): void {
		this.scene.load.image(this.BLOOD_FLASK_TEXTURE, 'flasks/red_thickglass.png');
		this.scene.load.image(this.EMPTY_BLOOD_FLASK_TEXTURE, 'flasks/empty_thickglass.png');
	}

	create(): void {
		for (let i = 0; i < this.INITIAL_HEALTH; i++) {
			const flask = this.scene.add.image( SCREEN_WIDTH - i * 40 - 24, 24, this.BLOOD_FLASK_TEXTURE)
				.setScrollFactor(0)
				.setOrigin(1, 0)
				.setScale(0.08, 0.08)
				.setDepth(DepthLayer.UI);
			this.healthFlasks.push(flask);
		}

		this.reRenderHealth();
	}

	hurt(): void {
		this.health--;

		this.reRenderHealth();

		if (this.health === 0) {
			this.die();
		}
	}

	die(): void {
		this.gameManager.deathScene();
	}

	private reRenderHealth(): void {
		for (let i = 0; i < this.INITIAL_HEALTH; i++) {
			const flask = this.healthFlasks[i];
			if (i < this.health) {
				flask.setTexture(this.BLOOD_FLASK_TEXTURE);
			} else {
				flask.setTexture(this.EMPTY_BLOOD_FLASK_TEXTURE);
			}
		}
	}
}