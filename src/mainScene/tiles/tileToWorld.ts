import { TILE_SIZE } from './TILE_SCALE.ts';

export function tileToWorld(x: number, y: number): { x: number; y: number } {
  return {
	x: x * TILE_SIZE,
	y: y * TILE_SIZE,
  }
}