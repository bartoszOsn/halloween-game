import { Point } from '../../../src/util/Point.ts';

export class ToolbarInfoService {

	private positionElement: HTMLParagraphElement | null = null;
	private worldPositionElement: HTMLParagraphElement | null = null;

	init(container: HTMLDivElement): void {
		this.createDOM(container);
	}

	setPosition(point: Point): void {
		if (this.positionElement) {
			this.positionElement.innerText = `x: ${point.x}, y: ${point.y}`;
		}
	}

	setWorldPosition(point: Point): void {
		if (this.worldPositionElement) {
			this.worldPositionElement.innerText = `world x: ${point.x}, world y: ${point.y}`;
		}
	}

	private createDOM(container: HTMLDivElement): void {
		const info = document.createElement('div');
		this.positionElement = document.createElement('p');
		this.worldPositionElement = document.createElement('p');

		info.appendChild(this.positionElement);
		info.appendChild(this.worldPositionElement);

		container.appendChild(info);
	}
}