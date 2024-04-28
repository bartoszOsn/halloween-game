import { inject } from '../../util/Container';
import { LEVEL_TOKEN } from '../levels/LevelToken';
import { PlayerFacingSide, PlayerState, PlayerStateEvent, PlayerStateService } from './PlayerStateService';
import { tileToWorld } from '../tiles/tileToWorld.ts';
import { SCREEN_HEIGHT } from '../../screenDimensions.ts';

export class PlayerPartial {
	private readonly LAST_TIME_ON_GROUND_JUMP_THRESHOLD = 150;
	private readonly JUMP_SPEED = 330;
	private readonly SPEED = 250;
	private readonly KNOCKBACK_VECTOR = new Phaser.Math.Vector2(300, -300);

	private readonly scene = inject(Phaser.Scene);
	private readonly level = inject(LEVEL_TOKEN);
	private readonly playerStateService = inject(PlayerStateService);

	public playerImage: Phaser.Physics.Arcade.Sprite | null = null;

	private keys: Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key> | null = null;
	private lastTimeOnGround: number = 0;

	load() {
		for (let i = 1; i <= 8; i++) {
			this.scene.load.image(`player-walk-${i}`, `/player/walk-idle/go_${i}.png`);
		}
	}

	create() {
		this.scene.anims.create({
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
			repeat: -1
		});
		const worldStartPosition = tileToWorld(this.level.startPosition.x, this.level.startPosition.y);
		this.playerImage = this.scene.physics.add.sprite(worldStartPosition.x, worldStartPosition.y, 'player-walk-1')
			.setGravityY(600)
			.setCollideWorldBounds(true)
			.setDragX(1000)
			.setScale(0.19, 0.19);

		this.keys = this.scene.input.keyboard?.addKeys('W,A,S,D') as any;
		this.scene.cameras.main.startFollow(this.playerImage, false, 1, 1, 0, SCREEN_HEIGHT / 6);

		this.playerStateService.on(PlayerStateEvent.ENTER_STATE, (newState: PlayerState) => {
			if (newState === 'walking') {
				this.playerImage?.anims.play('player-walk', true);
			} else if (newState === 'idle') {
				this.playerImage?.anims.stop();
				this.playerImage?.setFrame('player-walk-1');
			} else if (newState === 'hurt') {
				this.playerImage?.anims.stop();
				this.playerImage?.setFrame('player-walk-1');
				this.playerImage?.setVelocity(this.KNOCKBACK_VECTOR.x * (this.playerStateService.getProps().lastHurtFrom === 'left' ? 1 : -1), this.KNOCKBACK_VECTOR.y);
				this.playerImage?.setTint(0xff0000);
			}
		});

		this.playerStateService.on(PlayerStateEvent.EXIT_STATE, (oldState: PlayerState) => {
			if (oldState === 'hurt') {
				this.playerImage?.clearTint();
			}
		});
	}

	update() {
		this.playerStateService.update();

		this.playerStateService.updateProps({
			leftKeyPressed: this.keys?.A.isDown,
			rightKeyPressed: this.keys?.D.isDown,
		});

		if (this.keys?.A.isDown) {
			this.playerStateService.updateProps({
				facingSide: PlayerFacingSide.Left
			});
		}

		if (this.keys?.D.isDown) {
			this.playerStateService.updateProps({
				facingSide: PlayerFacingSide.Right
			});
		}

		this.playerImage?.setFlipX(this.playerStateService.getProps().facingSide === PlayerFacingSide.Right);

		this.handleInput();
	}

	onCollisionWithGround() {
		this.lastTimeOnGround = this.scene.time.now;
	}

	hurtFrom(position: Phaser.Math.Vector2) {
		if (this.playerStateService.getState() === 'hurt') {
			return;
		}

		const side = this.playerImage!.x > position.x ? 'left' : 'right';
		this.playerStateService.updateProps({
			lastHurtFrom: side
		});
		this.playerStateService.setHurt(200);
	}

	private handleInput() {
		if (this.playerStateService.getState() !== 'hurt') {
			if (this.keys?.W.isDown && this.lastTimeOnGround + this.LAST_TIME_ON_GROUND_JUMP_THRESHOLD > this.scene.time.now) {
				this.playerImage?.setVelocityY(-this.JUMP_SPEED);
			}

			if (this.keys?.A.isDown) {
				this.playerImage?.setVelocityX(-this.SPEED);
			}

			if (this.keys?.D.isDown) {
				this.playerImage?.setVelocityX(this.SPEED);
			}
		}
	}
}