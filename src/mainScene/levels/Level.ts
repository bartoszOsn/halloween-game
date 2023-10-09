import Vector2 = Phaser.Math.Vector2;
import Rectangle = Phaser.Geom.Rectangle;

export interface Level {
	startPosition: Vector2;
	bounds: Rectangle;
	platforms: Vector2[];
	zombies: Vector2[];
}