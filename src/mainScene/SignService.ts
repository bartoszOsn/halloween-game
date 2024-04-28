import { inject } from '../util/Container.ts';
import { LEVEL_TOKEN } from './levels/LevelToken.ts';
import { tileToWorld, worldToTile } from './tiles/tileToWorld.ts';
import { PlayerPartial } from './player/PlayerPartial.ts';

export class SignService {
	private readonly scene = inject(Phaser.Scene);
	private readonly level = inject(LEVEL_TOKEN);
	private readonly playerPartial = inject(PlayerPartial);

	private readonly SIGN_TEXTURE = 'sign';
	private readonly DISTANCE = 60;

	private readonly signs: Set<Phaser.GameObjects.Image> = new Set();

	private signOverlay: Phaser.GameObjects.Group | null = null;
	private currentlyVisibleSign: Phaser.GameObjects.Image | null = null;

	preload() {
		this.scene.load.image(this.SIGN_TEXTURE, '/tiles/Objects/Sign.png');
	}

	create() {
		for (const sign of this.level.signs) {
			const worldPosition = tileToWorld(sign.position.x, sign.position.y);
			const signImage = this.scene.add.image(worldPosition.x, worldPosition.y, this.SIGN_TEXTURE)
				.setOrigin(0, 0.55)
				.setScale(0.5, 0.5);

			this.signs.add(signImage);
		}
	}

	update() {
		if (!this.playerPartial.playerImage) {
			return;
		}

		for (const sign of this.signs) {
			const playerCenter: Phaser.Math.Vector2 = this.playerPartial.playerImage.getCenter();
			const distance = playerCenter.distance(sign.getCenter());
			if (distance > this.DISTANCE) {
				if (sign === this.currentlyVisibleSign) {
					this.removeSignOverlay();
				}
				continue;
			}

			if (!this.currentlyVisibleSign) {
				this.showSignOverlay(sign);
			}
		}
	}

	private showSignOverlay(sign: Phaser.GameObjects.Image) {
		this.removeSignOverlay();
		this.currentlyVisibleSign = sign;
		this.signOverlay = this.scene.add.group();

		const tilePos = worldToTile(sign.x, sign.y);

		const textContent = '\n' + this.level.signs.find(sign => sign.position.x === tilePos.x && sign.position.y === tilePos.y)?.text ?? '';

		const overlay = this.scene
			.add.rectangle(10, 10, 300, 150, 0x000000, 0.5)
			.setOrigin(0, 0)
			.setScrollFactor(0);
		const text = this.scene
			.add.text(0, 0, textContent, { color: '#ffffff', fontSize: '20px' })
			.setScrollFactor(0);

		Phaser.Display.Align.In.TopLeft(text, overlay, -16);
		this.signOverlay.add(overlay);
		this.signOverlay.add(text);

	}

	private removeSignOverlay() {
		if (this.signOverlay) {
			this.signOverlay.destroy(true);
			this.currentlyVisibleSign = null;
		}
	}
}