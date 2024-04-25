import Phaser from 'phaser';
import { Container } from '../../src/util/Container.ts';
import { BackgroundService } from './BackgroundService.ts';
import { CursorService } from './CursorService.ts';

export class EditorScene extends Phaser.Scene {
	private readonly container = new Container()
		.withValue(Phaser.Scene, this)
		.withClass(BackgroundService, BackgroundService)
		.withClass(CursorService, CursorService);

	private readonly backgroundService = this.container.get(BackgroundService);
	private readonly cursorService = this.container.get(CursorService);

	constructor() {
		super('editor scene');
	}

	preload(): void {
		this.backgroundService.preload();
	}

	create(): void {
		this.backgroundService.create();
		this.cursorService.create();
	}

	update(): void {
		this.cursorService.update();
	}
}