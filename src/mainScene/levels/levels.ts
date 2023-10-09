import { Level } from './Level';
import Rectangle = Phaser.Geom.Rectangle;

export const levels: Array<Level> = [
	{
		startPosition: new Phaser.Math.Vector2(200, 300),
		bounds: new Rectangle(0, -1024/2, 2000, 1024),
		platforms: [
			new Phaser.Math.Vector2(0, 0),
			new Phaser.Math.Vector2(10, -10),
			new Phaser.Math.Vector2(200, 550-100),
			new Phaser.Math.Vector2(500, 450-100),
			new Phaser.Math.Vector2(1000, 500-100),
			new Phaser.Math.Vector2(1500, 450-100)
		],
		zombies: [
			new Phaser.Math.Vector2(1000, 376),
		]
	}
]