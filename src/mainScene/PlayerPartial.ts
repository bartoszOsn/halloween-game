import { inject } from '../util/Container';
import { LEVEL_TOKEN } from './levels/LevelToken';

export enum PlayerFacingSide {
	Right,
	Left
}

export interface PlayerState {
	facingSide: PlayerFacingSide;
	lastTimeOnGround: number;
	isWalking: boolean;
}

export class PlayerPartial {
	private readonly LAST_TIME_ON_GROUND_JUMP_THRESHOLD = 150;
	private readonly JUMP_SPEED = 300;
	private readonly SPEED = 250;

	private readonly scene = inject(Phaser.Scene);
	private readonly level = inject(LEVEL_TOKEN);

	public playerImage: Phaser.Physics.Arcade.Sprite | null = null;
	private playerAnimation: Phaser.Animations.Animation | null = null;

	private keys: Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key> | null = null;
	private state: PlayerState = {
		facingSide: PlayerFacingSide.Right,
		lastTimeOnGround: Number.NEGATIVE_INFINITY,
		isWalking: false
	}

	load() {
		for (let i = 1; i <= 8; i++) {
			this.scene.load.image(`player-walk-${i}`, `/player/walk-idle/go_${i}.png`);
		}
	}

	create() {
		this.playerAnimation = this.scene.anims.create({
			key: 'player-walk',
			frames: [
				{ key: 'player-walk-1' },
				{ key: 'player-walk-2' },
				{ key: 'player-walk-3' },
				{ key: 'player-walk-4' },
				{ key: 'player-walk-5' },
				{ key: 'player-walk-6' },
				{ key: 'player-walk-7' },
				{ key: 'player-walk-8' },
			],
		}) as Phaser.Animations.Animation;
		this.playerImage = this.scene.physics.add.sprite(this.level.startPosition.x, this.level.startPosition.y, 'player-walk-1')
			.setGravityY(600)
			.setCollideWorldBounds(true)
			.setDragX(1000)
			.setScale(0.2, 0.2);

		this.keys = this.scene.input.keyboard?.addKeys('W,A,S,D') as any;
		this.scene.cameras.main.startFollow(this.playerImage);
	}

	update() {
		if (!this.keys) return;

		this.state.isWalking = this.keys.A.isDown || this.keys.D.isDown;

		if (this.keys.W.isDown && this.state.lastTimeOnGround + this.LAST_TIME_ON_GROUND_JUMP_THRESHOLD > this.scene.time.now) {
			this.playerImage?.setVelocityY(-this.JUMP_SPEED);
		}

		if (this.keys.A.isDown) {
			this.playerImage?.setVelocityX(-this.SPEED);
			this.state.facingSide = PlayerFacingSide.Left;
		}

		if (this.keys.D.isDown) {
			this.playerImage?.setVelocityX(this.SPEED);
			this.state.facingSide = PlayerFacingSide.Right;
		}


		this.playerImage?.setFlipX(this.state.facingSide === PlayerFacingSide.Right);
		if (this.state.isWalking) {
			this.playerImage?.anims.play(this.playerAnimation!, true);
			console.log(this.playerImage?.anims.currentFrame);
		} else {
			this.playerImage?.anims.stop();
			this.playerImage?.setFrame(0);
		}
	}

	onCollisionWithGround() {
		this.state.lastTimeOnGround = this.scene.time.now;
	}
}