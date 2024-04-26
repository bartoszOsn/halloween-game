import Phaser from 'phaser';
import { Container } from '../../src/util/Container.ts';
import { BackgroundService } from './BackgroundService.ts';
import { CursorService } from './CursorService.ts';
import { ToolbarService } from './toolbar/ToolbarService.ts';
import { ToolbarInfoService } from './toolbar/ToolbarInfoService.ts';
import { LevelRepository } from './LevelRepository.ts';
import { BoundService } from './BoundService.ts';
import { CameraService } from './CameraService.ts';
import { ToolbarToolsService } from './toolbar/ToolbarToolsService.ts';
import { BoundsTool } from './tools/BoundsTool.ts';
import { ToolsService } from './tools/ToolsService.ts';
import { PointerTool } from './tools/PointerTool.ts';

export class EditorScene extends Phaser.Scene {
	private readonly container = new Container()
		.withClass(LevelRepository, LevelRepository)
		.withValue(Phaser.Scene, this)
		.withClass(BackgroundService, BackgroundService)
		.withClass(CursorService, CursorService)
		.withClass(ToolbarService, ToolbarService)
		.withClass(ToolbarInfoService, ToolbarInfoService)
		.withClass(BoundService, BoundService)
		.withClass(CameraService, CameraService)
		.withClass(ToolbarToolsService, ToolbarToolsService)
		.withClass(ToolsService, ToolsService)

		.withClass(PointerTool, PointerTool)
		.withClass(BoundsTool, BoundsTool);

	private readonly cursorService = this.container.get(CursorService);
	private readonly toolbarService = this.container.get(ToolbarService);
	private readonly boundService = this.container.get(BoundService);
	private readonly cameraService = this.container.get(CameraService);
	private readonly toolsService = this.container.get(ToolsService);

	constructor() {
		super('editor scene');
	}

	preload(): void {
		this.boundService.preload();
	}

	create(): void {
		this.toolbarService.init();

		this.boundService.create();
		this.cursorService.create();
		this.cameraService.create();
		this.toolsService.create();
	}

	update(): void {
		this.cursorService.update();
		this.cameraService.update();
		this.toolsService.update();
	}
}