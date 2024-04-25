import Vector2 = Phaser.Math.Vector2;

export interface Level {
	startPosition: Vector2;
	sizeInTiles: {width: number, height: number};
	groundTiles: Array<{x: number, y: number}>;
	zombies: Vector2[];
}