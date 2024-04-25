import { Level } from './Level';
import Vector2 = Phaser.Math.Vector2;

export const levels: Array<Level> = [
	{
		startPosition: new Vector2(5, 47),
		sizeInTiles: {width: 50, height: 50},
		groundTiles: [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 0, y: 49 },
			{ x: 1, y: 49 },
			{ x: 2, y: 49 },
			{ x: 3, y: 49 },
			{ x: 4, y: 49 },
			{ x: 5, y: 49 },
			{ x: 6, y: 49 },
			{ x: 7, y: 49 },
			{ x: 8, y: 49 },
			{ x: 9, y: 49 },
		],
		zombies: [
			new Vector2(9, 48.5),
		]
	}
]