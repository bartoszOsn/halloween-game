import { Container, inject } from './util/Container.ts';
import { QueryParams } from './handleQueryParams.ts';
import { Level } from './mainScene/levels/Level.ts';
import { createMainScene } from './mainScene/createMainScene.ts';
import { levels } from './mainScene/levels/levels.ts';
import { DeathScene } from './death-scene/DeathScene.ts';

export class GameManager {
	private readonly game = inject(Phaser.Game);
	private readonly queryParams = inject(QueryParams);
	private readonly container: Container = inject(Container);

	private lastStartedLevel: Level | null = null;

	init(): void {
		const level = this.queryParams.level ?? levels[0];
		this.startLevel(level);
		this.lastStartedLevel = level;
	}

	startLevel(level: Level): void {
		const scene = createMainScene(this.container, level);
		this.startScene(scene, 'main');
	}

	nextLevel(): void {
		const levelIndex = levels.indexOf(this.lastStartedLevel!);
		const nextLevel = levels[levelIndex + 1];
		if (nextLevel) {
			this.startLevel(nextLevel);
			this.lastStartedLevel = nextLevel;
		} else {
			this.startLevel(levels[0]);
		}
	}

	deathScene(): void {
		const scene = this.container.child()
			.withClass(DeathScene, DeathScene)
			.get(DeathScene);

		this.startScene(scene, 'death');
	}

	private clearScenes(): void {
		for (let scene of this.game.scene.scenes) {
			this.game.scene.remove(scene as unknown as string);
		}
	}

	private startScene(scene: Phaser.Scene, sceneKey: string): void {
		const fadeTime = this.game.scene.scenes.length > 0 ? 500 : 0;
		if (this.game.scene.scenes.length > 0) {
			this.game.pause();
			this.game.scene.scenes[0].cameras.main.fadeOut(fadeTime);
		}
		setTimeout(() => {
			this.clearScenes();
			this.game.scene.add(sceneKey, scene, true);
			this.game.scene.scenes[0].cameras.main.fadeIn(fadeTime);
			this.game.resume();
		}, fadeTime);
	}
}