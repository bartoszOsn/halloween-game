import { Container, inject } from './util/Container.ts';
import { QueryParams } from './handleQueryParams.ts';
import { Level } from './mainScene/levels/Level.ts';
import { createMainScene } from './mainScene/createMainScene.ts';
import { levels } from './mainScene/levels/levels.ts';

export class GameManager {
	private readonly game = inject(Phaser.Game);
	private readonly queryParams = inject(QueryParams);
	private readonly container: Container = inject(Container);

	init(): void {
		const level = this.queryParams.level ?? levels[0];
		this.startLevel(level);
	}

	startLevel(level: Level): void {
		const scene = createMainScene(this.container, level);
		this.clearScenes();
		this.game.scene.add('main', scene, true);
	}

	private clearScenes(): void {
		for (let scene of this.game.scene.scenes) {
			this.game.scene.remove(scene as unknown as string);
		}
	}
}