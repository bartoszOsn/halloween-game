import Phaser from 'phaser';
import { Container } from '../util/Container.ts';
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
import { LevelRenderService } from './LevelRenderService.ts';
import { StartPositionTool } from './tools/StartPositionTool.ts';
import { TileTool } from './tools/TileTool.ts';
import { ToolbarPreviewService } from './toolbar/ToolbarPreviewService.ts';
import { ZombieTool } from './tools/ZombieTool.ts';
import { TileAreaTool } from './tools/TileAreaTool.ts';
import { DialogService } from './util/DialogService.ts';
import { SignTool } from './tools/SignTool.ts';
import { ToolbarLevelJsonService } from './toolbar/ToolbarLevelJsonService.ts';
import { ToolbarResetLevelService } from './toolbar/ToolbarResetLevelService.ts';
import { LEVEL_STORAGE_KEY } from '../LEVEL_STORAGE_KEY.ts';

export class EditorScene extends Phaser.Scene {
	private readonly container = new Container()
		.withClass(LevelRepository, LevelRepository)
		.withValue(Phaser.Scene, this)
		.withClass(DialogService, DialogService)
		.withClass(BackgroundService, BackgroundService)
		.withClass(CursorService, CursorService)
		.withClass(ToolbarService, ToolbarService)
		.withClass(ToolbarInfoService, ToolbarInfoService)
		.withClass(BoundService, BoundService)
		.withClass(CameraService, CameraService)
		.withClass(ToolbarToolsService, ToolbarToolsService)
		.withClass(ToolsService, ToolsService)
		.withClass(LevelRenderService, LevelRenderService)
		.withClass(ToolbarPreviewService, ToolbarPreviewService)
		.withClass(ToolbarLevelJsonService, ToolbarLevelJsonService)
		.withClass(ToolbarResetLevelService, ToolbarResetLevelService)

		.withClass(PointerTool, PointerTool)
		.withClass(BoundsTool, BoundsTool)
		.withClass(StartPositionTool, StartPositionTool)
		.withClass(TileTool, TileTool)
		.withClass(TileAreaTool, TileAreaTool)
		.withClass(ZombieTool, ZombieTool)
		.withClass(SignTool, SignTool);

	private readonly cursorService = this.container.get(CursorService);
	private readonly toolbarService = this.container.get(ToolbarService);
	private readonly boundService = this.container.get(BoundService);
	private readonly cameraService = this.container.get(CameraService);
	private readonly toolsService = this.container.get(ToolsService);
	private readonly levelRenderService = this.container.get(LevelRenderService);
	private readonly levelRepository = this.container.get(LevelRepository);

	constructor() {
		super('editor scene');
	}

	preload(): void {
		this.boundService.preload();
		this.levelRenderService.preload();
	}

	create(): void {
		this.toolbarService.init();

		this.boundService.create();
		this.cursorService.create();
		this.cameraService.create();
		this.toolsService.create();
		this.levelRenderService.create();

		const lsRaw = localStorage.getItem(LEVEL_STORAGE_KEY);
		if (lsRaw) {
			const level = JSON.parse(lsRaw);
			this.levelRepository.loadLevel(level);
		}
	}

	update(): void {
		this.cursorService.update();
		this.cameraService.update();
		this.toolsService.update();
	}
}