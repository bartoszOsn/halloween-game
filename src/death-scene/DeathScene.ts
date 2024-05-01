// import { inject } from '../util/Container.ts';
// import { GameManager } from '../GameManager.ts';
import Phaser from 'phaser';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../screenDimensions.ts';

export class DeathScene extends Phaser.Scene {
	// private readonly gameManager = inject(GameManager);

	private readonly DEATH_SPLASH_SCREEN = 'death-splash-screen';

	preload(): void {
		this.load.image(this.DEATH_SPLASH_SCREEN, '/splash/nosferatu.png');
	}

	create(): void {
		const splashScreen = this.add.image(0, 0, this.DEATH_SPLASH_SCREEN)
			.setOrigin(0, 0)
			.setDisplaySize(SCREEN_WIDTH, SCREEN_HEIGHT)
			.setAlpha(0);

		const text = this.add.text(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, 'YOU DIED', {
			fontSize: '96px',
			color: '#f3efef',
			fontFamily: 'sans-serif',
			fontStyle: 'bold'
		})
			.setOrigin(0.5, 0.5)
			.setAlpha(0);

		const fx = this.cameras.main.postFX.addColorMatrix();

		this.tweens.add({
			targets: splashScreen,
			alpha: 1,
			duration: 3000,
			ease: 'Power2'
		});

		this.tweens.add({
			targets: text,
			alpha: 1,
			duration: 3000,
			delay: 500,
			ease: 'Power2'
		});

		this.tweens.addCounter({
			from: 0,
			to: 1,
			duration: 10000,
			delay: 500,
			ease: 'Power2',
			onUpdate: (tween) => {
				fx.saturate(-tween.getValue());
				fx.contrast(tween.getValue() * 2, true);
			}
		});
	}
}