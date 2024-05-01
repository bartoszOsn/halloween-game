import { EventEmitter } from './util/EventEmitter.ts';
import { Size } from '../util/Size.ts';
import { Point } from '../util/Point.ts';
import { Level } from '../mainScene/levels/Level.ts';
import { LEVEL_STORAGE_KEY } from '../LEVEL_STORAGE_KEY.ts';

export class LevelRepository extends EventEmitter<{
	'sizeInTilesChanged': Size;
	'startPositionChanged': Point;
	'tileAdded': Point;
	'tileRemoved': Point;
	'zombieAdded': Point;
	'zombieRemoved': Point;
	'signAdded': Level['signs'][number];
	'signRemoved': Level['signs'][number];
	'exitGatePositionChanged': Point;
	'exitGateTriggerPositionChanged': Point;
	'exitGateTriggerRemoved': void;
	'garlicWallAdded': Level['garlicWalls'][number];
	'garlicWallRemoved': Level['garlicWalls'][number];
}> {
	private readonly level: Level = {
		sizeInTiles: { width: 50, height: 30 },
		startPosition: { x: 0, y: 0 },
		groundTiles: [
		],
		zombies: [],
		signs: [],
		exitGate: {
			position: { x: 0, y: 0 }
		},
		garlicWalls: []
	}

	constructor() {
		super();
	}

	get(): Level {
		return this.level;
	}

	setSizeInTiles(sizeInTiles: Size): void {
		this.level.sizeInTiles = sizeInTiles;
		this.emit('sizeInTilesChanged', sizeInTiles);
		this.saveInLS();
	}

	setStartPosition(startPosition: Point): void {
		this.level.startPosition = startPosition;
		this.emit('startPositionChanged', startPosition);
		this.saveInLS();
	}

	addTile(tile: Point): void {
		if (!this.hasTile(tile)) {
			this.level.groundTiles.push(tile);
			this.emit('tileAdded', tile);
			this.saveInLS();
		}
	}

	removeTile(tile: Point): void {
		if (this.hasTile(tile)) {
			this.level.groundTiles = this.level.groundTiles.filter(t => t.x !== tile.x || t.y !== tile.y);
			this.emit('tileRemoved', tile);
			this.saveInLS();
		}
	}

	addZombie(zombie: Point): void {
		if (!this.hasZombie(zombie)) {
			this.level.zombies.push(zombie);
			this.emit('zombieAdded', zombie);
			this.saveInLS();
		}
	}

	removeZombie(zombie: Point): void {
		if (this.hasZombie(zombie)) {
			this.level.zombies = this.level.zombies.filter(z => z.x !== zombie.x || z.y !== zombie.y);
			this.emit('zombieRemoved', zombie);
			this.saveInLS();
		}
	}

	addSign(position: Point, text: string): void {
		if (!this.hasSign(position)) {
			const sign: Level['signs'][number] = { position, text };
			this.level.signs.push(sign);
			this.emit('signAdded', sign);
			this.saveInLS();
		}
	}

	removeSign(position: Point): void {
		if (this.hasSign(position)) {
			const sign = this.level.signs.find(sign => sign.position.x === position.x && sign.position.y === position.y)!;
			this.level.signs = this.level.signs.filter(s => s.position.x !== position.x || s.position.y !== position.y);
			this.emit('signRemoved', sign);
			this.saveInLS();
		}
	}

	setExitGatePosition(position: Point): void {
		this.level.exitGate.position = position;
		this.emit('exitGatePositionChanged', position);
		this.saveInLS();
	}

	setExitGateTriggerPosition(position: Point): void {
		this.level.exitGate.triggerPosition = position;
		this.emit('exitGateTriggerPositionChanged', position);
		this.saveInLS();
	}

	removeExitGateTrigger(): void {
		delete this.level.exitGate.triggerPosition;
		this.emit('exitGateTriggerRemoved', void 0);
		this.saveInLS();
	}

	addGarlicWall(position: Point, length: number): void {
		if (this.hasGarlicWall(position)) {
			return;
		}

		this.level.garlicWalls.push({ position, length });
		this.emit('garlicWallAdded', { position, length });
		this.saveInLS();
	}

	removeGarlicWall(position: Point): void {
		if (!this.hasGarlicWall(position)) {
			return;
		}

		const wall = this.level.garlicWalls.find(wall => wall.position.x <= position.x && wall.position.x + wall.length >= position.x && wall.position.y === position.y);

		if (!wall) {
			return;
		}

		this.level.garlicWalls = this.level.garlicWalls.filter(wall => wall.position.x !== position.x || wall.position.y !== position.y);
		this.emit('garlicWallRemoved', wall);
		this.saveInLS();
	}

	reset(): void {
		this.setStartPosition({ x: 0, y: 0 });
		this.setSizeInTiles({ width: 50, height: 30 });
		for (const groundTile of this.level.groundTiles) {
			this.removeTile(groundTile);
		}

		for (const zombie of this.level.zombies) {
			this.removeZombie(zombie);
		}

		for (const sign of this.level.signs) {
			this.removeSign(sign.position);
		}

		this.setExitGatePosition({ x: 0, y: 0 });
		this.removeExitGateTrigger();
		this.saveInLS();
	}

	loadLevel(level: Level): void {
		this.reset();
		this.setSizeInTiles(level.sizeInTiles);
		this.setStartPosition(level.startPosition);
		for (const groundTile of level.groundTiles) {
			this.addTile(groundTile);
		}

		for (const zombie of level.zombies) {
			this.addZombie(zombie);
		}

		for (const sign of level.signs) {
			this.addSign(sign.position, sign.text);
		}

		this.setExitGatePosition(level.exitGate.position);
		if (level.exitGate.triggerPosition) {
			this.setExitGateTriggerPosition(level.exitGate.triggerPosition);
		}

		for (const wall of level.garlicWalls) {
			this.addGarlicWall(wall.position, wall.length);
		}
	}

	private hasTile(tile: Point): boolean {
		return this.level.groundTiles.some(t => t.x === tile.x && t.y === tile.y);
	}

	private hasZombie(zombie: Point): boolean {
		return this.level.zombies.some(z => z.x === zombie.x && z.y === zombie.y);
	}

	private hasSign(position: Point): boolean {
		return this.level.signs.some(sign => sign.position.x === position.x && sign.position.y === position.y);
	}

	private hasGarlicWall(position: Point): boolean {
		return this.level.garlicWalls.some(wall => wall.position.x <= position.x && wall.position.x + wall.length >= position.x && wall.position.y === position.y);

	}

	private saveInLS(): void {
		localStorage.setItem(LEVEL_STORAGE_KEY, JSON.stringify(this.level));
	}
}