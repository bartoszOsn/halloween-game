import { EventEmitter } from './util/EventEmitter.ts';
import { Size } from '../../src/util/Size.ts';
import { Point } from '../../src/util/Point.ts';
import { Level } from '../../src/mainScene/levels/Level.ts';

export class LevelRepository extends EventEmitter<{
	'sizeInTilesChanged': Size;
	'startPositionChanged': Point;
	'tileAdded': Point;
	'tileRemoved': Point;
	'zombieAdded': Point;
	'zombieRemoved': Point;
}> {
	private readonly level: Level = {
		sizeInTiles: { width: 50, height: 30 },
		startPosition: { x: 0, y: 0 },
		groundTiles: [
		],
		zombies: []
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
	}

	setStartPosition(startPosition: Point): void {
		this.level.startPosition = startPosition;
		this.emit('startPositionChanged', startPosition);
	}

	addTile(tile: Point): void {
		if (!this.hasTile(tile)) {
			this.level.groundTiles.push(tile);
			this.emit('tileAdded', tile);
		}
	}

	removeTile(tile: Point): void {
		if (this.hasTile(tile)) {
			this.level.groundTiles = this.level.groundTiles.filter(t => t.x !== tile.x || t.y !== tile.y);
			this.emit('tileRemoved', tile);
		}
	}

	addZombie(zombie: Point): void {
		if (!this.hasZombie(zombie)) {
			this.level.zombies.push(zombie);
			this.emit('zombieAdded', zombie);
		}
	}

	removeZombie(zombie: Point): void {
		if (this.hasZombie(zombie)) {
			this.level.zombies = this.level.zombies.filter(z => z.x !== zombie.x || z.y !== zombie.y);
			this.emit('zombieRemoved', zombie);
		}
	}

	private hasTile(tile: Point): boolean {
		return this.level.groundTiles.some(t => t.x === tile.x && t.y === tile.y);
	}

	private hasZombie(zombie: Point): boolean {
		return this.level.zombies.some(z => z.x === zombie.x && z.y === zombie.y);
	}
}