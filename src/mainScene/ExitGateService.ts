import { LEVEL_TOKEN } from './levels/LevelToken.ts';
import { inject } from '../util/Container.ts';
import Phaser from 'phaser';
import { tileToWorld } from './tiles/tileToWorld.ts';
import { PlayerPartial } from './player/PlayerPartial.ts';
import { TILE_SIZE } from './tiles/TILE_SCALE.ts';

export class ExitGateService {
	private readonly level = inject(LEVEL_TOKEN);
	private readonly scene = inject(Phaser.Scene);
	private readonly playerPartial = inject(PlayerPartial);

	private readonly GATE_TEXTURE = 'gate';
	private readonly GATE_ANIMATION = 'gate-animation';
	private readonly PRESSURE_PLATE_NORMAL_TEXTURE = 'pressure_plate_normal';
	private readonly PRESSURE_PLATE_TRIGGERED_TEXTURE = 'pressure_plate_triggered';
	private readonly DISTANCE_TO_GATE = 50;

	private gate: Phaser.GameObjects.Sprite | null = null;
	private pressurePlate: Phaser.GameObjects.Image | null = null;

	private isGateOpen = false;

	preload(): void {
		this.scene.load.spritesheet(this.GATE_TEXTURE, '/stone_gate.png', { frameWidth: 160, frameHeight: 160 });
		this.scene.load.image(this.PRESSURE_PLATE_NORMAL_TEXTURE, '/pressing plate (normal).png');
		this.scene.load.image(this.PRESSURE_PLATE_TRIGGERED_TEXTURE, '/pressing plate (triggered).png');
	}

	create(): void {
		this.scene.anims.create({
			key: this.GATE_ANIMATION,
			frames: this.scene.anims.generateFrameNumbers(this.GATE_TEXTURE, { start: 4, end: 15 }),
			repeat: 0
		});

		const gatePosition = tileToWorld(this.level.exitGate.position.x, this.level.exitGate.position.y);

		this.gate = this.scene.add.sprite(gatePosition.x, gatePosition.y - TILE_SIZE * 2.5, this.GATE_TEXTURE, 1)
			.setOrigin(0, 0);

		if (!this.level.exitGate.triggerPosition) {
			this.gate?.setFrame(15);
		} else {
			const pressurePlatePosition = tileToWorld(this.level.exitGate.triggerPosition.x, this.level.exitGate.triggerPosition.y);
			this.pressurePlate = this.scene.add.image(pressurePlatePosition.x, pressurePlatePosition.y + TILE_SIZE / 3, this.PRESSURE_PLATE_NORMAL_TEXTURE)
				.setOrigin(0, 0);
		}
	}

	update(): void {
		if (this.playerPartial.playerImage && this.gate) {
			const playerPosition = this.playerPartial.playerImage.getCenter();

			if (this.level.exitGate.triggerPosition) {
				const gateTriggerPosition = this.pressurePlate!.getCenter();
				const distance = Phaser.Math.Distance.Between(playerPosition.x ?? 0, playerPosition.y ?? 0, gateTriggerPosition.x ?? 0, gateTriggerPosition.y ?? 0);
				if (distance < this.DISTANCE_TO_GATE) {
					this.openGate();
					this.pressurePlate?.setTexture(this.PRESSURE_PLATE_TRIGGERED_TEXTURE);
				} else {
					this.closeGate();
					this.pressurePlate?.setTexture(this.PRESSURE_PLATE_NORMAL_TEXTURE);
				}
			}
		}
	}

	private openGate(): void {
		if (this.isGateOpen) {
			return;
		}

		this.gate?.anims.play(this.GATE_ANIMATION);
		this.isGateOpen = true;
	}

	private closeGate(): void {
		if (!this.isGateOpen) {
			return;
		}

		this.gate?.anims.playReverse(this.GATE_ANIMATION);
		this.isGateOpen = false;
	}
}