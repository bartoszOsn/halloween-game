import { Tool } from './Tool.ts';
import { BoundsTool } from './BoundsTool.ts';
import { inject } from '../../../src/util/Container.ts';
import { ToolbarToolsService } from '../toolbar/ToolbarToolsService.ts';
import { PointerTool } from './PointerTool.ts';
import { StartPositionTool } from './StartPositionTool.ts';
import { TileTool } from './TileTool.ts';
import { ZombieTool } from './ZombieTool.ts';
import { TileAreaTool } from './TileAreaTool.ts';
import { SignTool } from './SignTool.ts';
import { ExitGateTool } from './ExitGateTool.ts';
import { GarlicWallTool } from './GarlicWallTool.ts';

const tools: Array<{ new (): Tool }> = [
	PointerTool,
	BoundsTool,
	StartPositionTool,
	ExitGateTool,
	TileTool,
	TileAreaTool,
	ZombieTool,
	SignTool,
	GarlicWallTool
];

export class ToolsService {
	private readonly tools = tools.map(toolConstructor => inject(toolConstructor));
	private readonly toolbarToolsService = inject(ToolbarToolsService);

	private selectedTool: Tool | null = null;

	create(): void {
		this.toolbarToolsService.on('toolSelected', (toolId: string) => {
			this.selectedTool?.deactivate();
			this.selectedTool = this.tools.find(tool => tool.id === toolId) || null;
			this.selectedTool?.activate();
		})

		for (const tool of this.tools) {
			this.toolbarToolsService.addTool(tool);
		}

		this.toolbarToolsService.selectTool(this.tools[0]);
	}

	update(): void {
		this.selectedTool?.update();
	}
}