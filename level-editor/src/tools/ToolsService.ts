import { Tool } from './Tool.ts';
import { BoundsTool } from './BoundsTool.ts';
import { inject } from '../../../src/util/Container.ts';
import { ToolbarToolsService } from '../toolbar/ToolbarToolsService.ts';
import { PointerTool } from './PointerTool.ts';

const tools: Array<{ new (): Tool }> = [
	PointerTool,
	BoundsTool
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