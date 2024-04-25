import { Level } from './Level';
import Rectangle = Phaser.Geom.Rectangle;
import Vector2 = Phaser.Math.Vector2;

export const levels: Array<Level> = [
	{
		startPosition: new Vector2(200, 300),
		bounds: new Rectangle(0, -1024/2, 2000, 1024),
		platforms: [
			new Vector2(0, 0),
			new Vector2(10, -10),
			new Vector2(200, 550-100),
			new Vector2(500, 450-100),
			new Vector2(1000, 500-100),
			new Vector2(1500, 450-100)
		],
		zombies: [
			new Vector2(1000, 376),
		]
	}
]