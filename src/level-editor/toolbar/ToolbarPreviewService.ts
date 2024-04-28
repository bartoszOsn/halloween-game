export class ToolbarPreviewService {

	init(container: HTMLElement): void {
		const button = document.createElement('button');
		button.innerText = 'Preview';
		button.style.width = '100%';
		button.style.padding = '8px';

		button.addEventListener('click', () => {
			const url = `http://localhost:5173/?level`;
			window.open(url, '_blank');
		});

		container.append(button);
	}
}