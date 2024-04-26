import { SCREEN_HEIGHT } from '../../../src/screenDimensions.ts';
import { ToolbarInfoService } from './ToolbarInfoService.ts';
import { inject } from '../../../src/util/Container.ts';
import { ToolbarToolsService } from './ToolbarToolsService.ts';
import { ToolbarPreviewService } from './ToolbarPreviewService.ts';

export class ToolbarService {
	private readonly toolbarInfoService = inject(ToolbarInfoService);
	private readonly toolbarToolsService = inject(ToolbarToolsService);
	private readonly toolbarPreviewService = inject(ToolbarPreviewService);

	init(): void {
		this.createDOM();
	}

	private createDOM(): void {
		const container = document.createElement('div');
		container.style.height = `${SCREEN_HEIGHT}px`;
		container.style.border = '1px solid black';
		container.style.display = 'flex';
		container.style.flexDirection = 'column';
		container.style.gap = '8px';
		container.style.padding = '16px';
		container.style.width = '100%';
		container.style.justifyContent = 'space-between';

		this.toolbarInfoService.init(container);
		this.toolbarToolsService.init(container);
		this.toolbarPreviewService.init(container);

		document.body.prepend(container);
	}
}