import { Point } from '../../util/Point.ts';
import { Size } from '../../util/Size.ts';

export interface Level {
	startPosition: Point;
	sizeInTiles: Size;
	groundTiles: Array<Point>;
	zombies: Array<Point>;
	signs: Array<{
		position: Point;
		text: string;
	}>;
	exitGate: {
		position: Point;
		triggerPosition?: Point;
	},
	garlicWalls: Array<{
		position: Point;
		length: number;
	}>
}