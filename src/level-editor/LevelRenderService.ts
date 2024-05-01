import { inject } from '../../src/util/Container.ts';
import { LevelRepository } from './LevelRepository.ts';
import { TILE_SCALE, TILE_SIZE } from '../../src/mainScene/tiles/TILE_SCALE.ts';
import { tileToWorld } from '../../src/mainScene/tiles/tileToWorld.ts';
import { Point } from '../../src/util/Point.ts';
import { Level } from '../../src/mainScene/levels/Level.ts';
import { DepthLayer } from '../DepthLayer.ts';

export class LevelRenderService {
	private readonly scene = inject(Phaser.Scene);
	private readonly levelRepository = inject(LevelRepository);

	private readonly TILE_TEXTURE = 'tile';
	private readonly GRAVE_TEXTURE = 'grave';
	private readonly SIGN_TEXTURE = 'sign';
	private readonly GATE_TEXTURE = 'gate';
	private readonly GATE_TRIGGER_TEXTURE = 'gateTrigger';

	private startPositionMark: Phaser.GameObjects.Arc | null = null;
	private gateMark: Phaser.GameObjects.Sprite | null = null;
	private gateTrigger: Phaser.GameObjects.Image | null = null;

	private tiles: Set<Phaser.GameObjects.Image> = new Set();
	private graves: Set<Phaser.GameObjects.Image> = new Set();
	private signs: Set<Phaser.GameObjects.Image> = new Set();
	private garlics: Map<Point, Phaser.GameObjects.Rectangle> = new Map();

	preload(): void {
		this.scene.load.image(this.TILE_TEXTURE, '/tiles/Tiles/Tile (5).png');
		this.scene.load.image(this.GRAVE_TEXTURE, '/tiles/Objects/TombStone (1).png');
		this.scene.load.image(this.SIGN_TEXTURE, '/tiles/Objects/Sign.png');
		this.scene.load.spritesheet(this.GATE_TEXTURE, '/stone_gate.png', { frameWidth: 160, frameHeight: 160 });
		this.scene.load.image(this.GATE_TRIGGER_TEXTURE, '/pressing plate (normal).png');
	}

	create(): void {
		this.createStartPositionMark();
		this.createGateMark();

		this.levelRepository.on('startPositionChanged', () => this.renderStartPosition());
		this.levelRepository.on('tileAdded', (tile) => this.addTile(tile));
		this.levelRepository.on('tileRemoved', (tile) => this.removeTile(tile));
		this.levelRepository.on('zombieAdded', (zombie) => this.addGrave(zombie));
		this.levelRepository.on('zombieRemoved', (zombie) => this.removeGrave(zombie));
		this.levelRepository.on('signAdded', (sign) => this.addSign(sign));
		this.levelRepository.on('signRemoved', (sign) => this.removeSign(sign));
		this.levelRepository.on('exitGatePositionChanged', () => this.renderGate());
		this.levelRepository.on('exitGateTriggerRemoved', () => this.renderGate());
		this.levelRepository.on('exitGateTriggerPositionChanged', () => this.renderGate());
		this.levelRepository.on('garlicWallAdded', (garlic) => this.addGarlic(garlic));
		this.levelRepository.on('garlicWallRemoved', (garlic) => this.removeGarlic(garlic));
	}

	private createStartPositionMark(): void {
		this.startPositionMark = this.scene.add.arc(0, 0, TILE_SIZE / 2, 0, 360, false, 0xff00ff, 0.5)
			.setDepth(DepthLayer.UI);
		this.renderStartPosition();
	}

	private createGateMark(): void {
		this.gateMark = this.scene.add.sprite(0, 0, this.GATE_TEXTURE, 0).setScale(0.5, 0.5)
			.setOrigin(0, 0)
			.setDepth(DepthLayer.DECORATIONS);
		this.gateTrigger = this.scene.add.image(0, 0, this.GATE_TRIGGER_TEXTURE)
			.setOrigin(0, 0)
			.setVisible(false)
			.setDepth(DepthLayer.DECORATIONS);
		this.renderGate();
	}

	private renderStartPosition(): void {
		const startPosition = this.levelRepository.get().startPosition;
		const { x, y } = tileToWorld(startPosition.x, startPosition.y);
		this.startPositionMark?.setPosition(x + TILE_SIZE / 2, y + TILE_SIZE / 2);
	}

	private renderGate(): void {
		const gate = this.levelRepository.get().exitGate;
		const { x, y } = tileToWorld(gate.position.x, gate.position.y);
		this.gateMark?.setPosition(x, y);
		if (gate.triggerPosition) {
			const trigger = tileToWorld(gate.triggerPosition.x, gate.triggerPosition.y);
			this.gateTrigger?.setVisible(true).setPosition(trigger.x, trigger.y);
		} else {
			this.gateTrigger?.setVisible(false);
		}
	}

	private addTile(tile: Point): void {
		const worldPosition = tileToWorld(tile.x, tile.y);
		const image = this.scene.add.image(worldPosition.x, worldPosition.y, this.TILE_TEXTURE)
			.setOrigin(0, 0)
			.setScale(TILE_SCALE, TILE_SCALE)
			.setDepth(DepthLayer.TILES);

		this.tiles?.add(image);
	}

	private removeTile(tile: Point): void {
		const worldPosition = tileToWorld(tile.x, tile.y);
		Array.from(this.tiles).filter((image) => image.x === worldPosition.x && image.y === worldPosition.y).forEach((image) => {
			image.destroy();
			this.tiles.delete(image);
		});
	}

	private addGrave(grave: Point): void {
		const worldPosition = tileToWorld(grave.x, grave.y);
		const image = this.scene.add.image(worldPosition.x, worldPosition.y, this.GRAVE_TEXTURE)
			.setOrigin(0, 0)
			.setScale(0.5, 0.5)
			.setDepth(DepthLayer.DECORATIONS);

		this.graves?.add(image);
	}

	private removeGrave(grave: Point): void {
		const worldPosition = tileToWorld(grave.x, grave.y);
		Array.from(this.graves).filter((image) => image.x === worldPosition.x && image.y === worldPosition.y).forEach((image) => {
			image.destroy();
			this.graves.delete(image);
		});
	}

	private addSign(sign: Level['signs'][0]): void {
		const worldPosition = tileToWorld(sign.position.x, sign.position.y);
		const image = this.scene.add.image(worldPosition.x, worldPosition.y, this.SIGN_TEXTURE)
			.setOrigin(0, 0)
			.setScale(0.35, 0.35)
			.setDepth(DepthLayer.DECORATIONS);

		this.signs?.add(image);
	}

	private removeSign(sign: Level['signs'][0]): void {
		const worldPosition = tileToWorld(sign.position.x, sign.position.y);
		Array.from(this.signs).filter((image) => image.x === worldPosition.x && image.y === worldPosition.y).forEach((image) => {
			image.destroy();
			this.signs.delete(image);
		});
	}

	private addGarlic(garlic: Level['garlicWalls'][number]): void {
		const worldPosition = tileToWorld(garlic.position.x, garlic.position.y);
		const { x: worldLength } = tileToWorld(garlic.length, 0);
		const rect = this.scene.add.rectangle(worldPosition.x, worldPosition.y, worldLength, TILE_SIZE, 0xffffff, 0.5)
			.setOrigin(0, 0)
			.setDepth(DepthLayer.UI);

		this.garlics?.set(garlic.position, rect);
	}

	private removeGarlic(garlic: Level['garlicWalls'][number]): void {
		const rect = this.garlics.get(garlic.position);
		if (rect) {
			rect.destroy();
			this.garlics.delete(garlic.position);
		}
	}
}