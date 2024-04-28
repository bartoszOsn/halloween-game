import { Level } from './mainScene/levels/Level.ts';

export type LevelMessagePayload = {
	type: 'levelSent';
	level: Level;
};

export type LevelRequestedMessage = {
	type: 'levelRequested';
}