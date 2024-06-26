import { inject } from '../util/Container';
import { LEVEL_TOKEN } from './levels/LevelToken';
import { TilesPartial } from './tiles/TilesPartial.ts';
import { PlayerPartial } from './player/PlayerPartial';
import { tileToWorld } from './tiles/tileToWorld.ts';
import { Point } from '../util/Point.ts';
import { DepthLayer } from '../DepthLayer.ts';

interface ZombieState {
	state: 'appearing' | 'walking';
	facing: 'left' | 'right';
	sprite: Phaser.Physics.Arcade.Sprite;
}

export class ZombieService {
	private readonly ZOMBIE_SPEED = 60;
	private readonly DISTANCE_TO_SPAWN = 300;
	private readonly TOMB_TEXTURE = 'tomb';

	private readonly level = inject(LEVEL_TOKEN);
	private readonly scene = inject(Phaser.Scene);
	private readonly platformsPartial = inject(TilesPartial);
	private readonly playerPartial = inject(PlayerPartial);

	private zombiesToSpawn = [...this.level.zombies].map(zombie => tileToWorld(zombie.x, zombie.y));
	public readonly zombies: Array<ZombieState> = [];
	private zombieGroup: Phaser.Physics.Arcade.Group | null = null;
	private tombGroup: Phaser.GameObjects.Group | null = null;

	load(): void {
		for (let i = 1; i <= 11; i++) {
			this.scene.load.image(`zombie-appear-${i}`, `/zombie/appear/appear_${i}.png`);
		}

		for (let i = 1; i <= 10; i++) {
			this.scene.load.image(`zombie-walk-${i}`, `/zombie/walk/go_${i}.png`);
		}

		this.scene.load.image(this.TOMB_TEXTURE, '/tiles/Objects/TombStone (1).png');
	}

	create(): void {
		this.scene.anims.create({
			key: 'zombie-appear',
			frames: [
				{ key: 'zombie-appear-1' },
				{ key: 'zombie-appear-2' },
				{ key: 'zombie-appear-3' },
				{ key: 'zombie-appear-4' },
				{ key: 'zombie-appear-5' },
				{ key: 'zombie-appear-6' },
				{ key: 'zombie-appear-7' },
				{ key: 'zombie-appear-8' },
				{ key: 'zombie-appear-9' },
				{ key: 'zombie-appear-10' },
				{ key: 'zombie-appear-11' }
			]
		});

		this.scene.anims.create({
			key: 'zombie-walk',
			frames: [
				{ key: 'zombie-walk-1' },
				{ key: 'zombie-walk-2' },
				{ key: 'zombie-walk-3' },
				{ key: 'zombie-walk-4' },
				{ key: 'zombie-walk-5' },
				{ key: 'zombie-walk-6' },
				{ key: 'zombie-walk-7' },
				{ key: 'zombie-walk-8' },
				{ key: 'zombie-walk-9' },
				{ key: 'zombie-walk-10' }
			]
		});

		this.zombieGroup = this.scene.physics.add.group().setDepth(DepthLayer.ENTITIES);

		if (!this.platformsPartial.group) {
			throw new Error('Platforms group is not initialized');
		}

		if (!this.playerPartial.playerImage) {
			throw new Error('Player image is not initialized');
		}

		this.scene.physics.add.collider(this.zombieGroup, this.platformsPartial.group);
		this.scene.physics.add.collider(
			this.zombieGroup,
			this.playerPartial.playerImage,
			(player, zombie) => {
				if (!(player instanceof Phaser.Physics.Arcade.Sprite) || !(zombie instanceof Phaser.Physics.Arcade.Sprite)) {
					return;
				}

			this.playerPartial.hurtFrom(zombie.getCenter());
			console.log(zombie, player);
			// this.playerPartial.playerImage?.setVelocity(this.KNOCKBACK_VECTOR.x, this.KNOCKBACK_VECTOR.y);
		});

		this.tombGroup = this.scene.add.group().setDepth(DepthLayer.DECORATIONS);
		for (const zombie of this.zombiesToSpawn) {
			const tomb = this.scene.add.image(zombie.x, zombie.y, this.TOMB_TEXTURE)
				.setOrigin(0.5, 0.5)
				.setTint(0x888888)
				.setScale(0.58, 0.58);
			this.tombGroup.add(tomb);
		}
	}

	update(): void {
		for (const zombieToSpawn of this.zombiesToSpawn) {
			const playerCenter: Phaser.Math.Vector2 = this.playerPartial.playerImage?.getCenter() || new Phaser.Math.Vector2(-1000, -1000);
			const distance = playerCenter.distance(zombieToSpawn);
			if (distance > this.DISTANCE_TO_SPAWN) {
				continue;
			}

			this.zombiesToSpawn = this.zombiesToSpawn.filter(zombie => zombie !== zombieToSpawn);
			this.spawnZombie(zombieToSpawn);
		}


		for (const zombie of this.zombies) {
			if (zombie.state !== 'walking') {
				continue;
			}

			if (zombie.sprite.body?.blocked.left) {
				zombie.facing = 'right';
			}

			if (zombie.sprite.body?.blocked.right) {
				zombie.facing = 'left';
			}

			if (zombie.facing === 'left') {
				zombie.sprite.setVelocityX(-this.ZOMBIE_SPEED);
			} else {
				zombie.sprite.setVelocityX(this.ZOMBIE_SPEED);
			}

			zombie.sprite.setFlipX(zombie.facing === 'right');
			zombie.sprite.play('zombie-walk', true);
		}
	}

	private spawnZombie(position: Point): void {

		const zombie = this.scene.physics.add.sprite(position.x, position.y, 'zombie-appear-1')
			.setOrigin(0.5, 1);


		this.zombieGroup?.add(zombie);

		zombie.setGravityY(600)
			.setCollideWorldBounds(true)
			.setDragX(1000)
			.setScale(0.2, 0.2)
			.play('zombie-appear', true);

		const state: ZombieState = {
			facing: 'left',
			state: 'appearing',
			sprite: zombie
		}

		zombie.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
			state.state = 'walking';
		});
		this.zombies.push(state);
	}
}