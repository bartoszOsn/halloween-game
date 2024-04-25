import Phaser from 'phaser';
import { Container } from '../../src/util/Container.ts';
import { BackgroundService } from './BackgroundService.ts';

export class EditorScene extends Phaser.Scene {
	private readonly container = new Container()
		.withValue(Phaser.Scene, this)
		.withClass(BackgroundService, BackgroundService);

	private readonly backgroundService = this.container.get(BackgroundService);

	constructor() {
		super('editor scene');
	}

	preload(): void {
		this.backgroundService.preload();
	}

	create(): void {
		this.backgroundService.create();
	}
}