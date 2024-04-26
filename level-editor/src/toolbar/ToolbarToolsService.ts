import { EventEmitter } from '../util/EventEmitter.ts';
import { Tool } from '../tools/Tool.ts';

export class ToolbarToolsService extends EventEmitter<{
	toolSelected: string;
}>{
	private container: HTMLDivElement | null = null;

	init(container: HTMLDivElement): void {
		this.createDOM(container);
	}

	addTool(tool: Tool): void {
		const btn = document.createElement('button');
		btn.innerText = `${tool.icon} ${tool.name}`;
		btn.style.padding = '8px';

		btn.dataset['tool'] = tool.name;

		btn.addEventListener('click', () => {
			this.selectTool(tool);
		});

		this.container?.appendChild(btn);
	}

	selectTool(tool: Tool): void {
		const buttons = this.container!.querySelectorAll('button');

		for (const button of buttons) {
			if (button.dataset['tool'] === tool.name) {
				button.style.backgroundColor = 'lightblue';
			} else {
				button.style.removeProperty('background-color');
			}
		}

		this.emit('toolSelected', tool.name);
	}

	private createDOM(container: HTMLDivElement): void {
		this.container = document.createElement('div');
		this.container.style.display = 'flex';
		this.container.style.flexDirection = 'column';
		this.container.style.gap = '4px';

		container.appendChild(this.container);
	}
}