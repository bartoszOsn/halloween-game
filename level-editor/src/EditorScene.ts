import Phaser from 'phaser';
import { Container } from '../../src/util/Container.ts';
import { BackgroundService } from './BackgroundService.ts';
import { CursorService } from './CursorService.ts';
import { ToolbarService } from './toolbar/ToolbarService.ts';
import { ToolbarInfoService } from './toolbar/ToolbarInfoService.ts';
import { LevelRepository } from './LevelRepository.ts';

export class EditorScene extends Phaser.Scene {
	private readonly container = new Container()
		.withClass(LevelRepository, LevelRepository)
		.withValue(Phaser.Scene, this)
		.withClass(BackgroundService, BackgroundService)
		.withClass(CursorService, CursorService)
		.withClass(ToolbarService, ToolbarService)
		.withClass(ToolbarInfoService, ToolbarInfoService);

	private readonly backgroundService = this.container.get(BackgroundService);
	private readonly cursorService = this.container.get(CursorService);
	private readonly toolbarService = this.container.get(ToolbarService);

	constructor() {
		super('editor scene');
	}

	preload(): void {
		this.backgroundService.preload();
	}

	create(): void {
		this.toolbarService.init();

		this.backgroundService.create();
		this.cursorService.create();
	}

	update(): void {
		this.cursorService.update();
	}
}