import { TILE_SIZE } from './TILE_SCALE.ts';
import { Point } from '../../util/Point.ts';

export function tileToWorld(x: number, y: number): Point {
  return {
	x: x * TILE_SIZE,
	y: y * TILE_SIZE,
  }
}

export function worldToTile(x: number, y: number): Point {
  return {
	x: Math.floor(x / TILE_SIZE),
	y: Math.floor(y / TILE_SIZE),
  }
}