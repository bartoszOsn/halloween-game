import { LevelRepository } from '../LevelRepository.ts';
import { inject } from '../../../src/util/Container.ts';

export class ToolbarPreviewService {
	private readonly levelRepository = inject(LevelRepository);

	init(container: HTMLElement): void {
		const button = document.createElement('button');
		button.innerText = 'Preview';
		button.style.width = '100%';
		button.style.padding = '8px';

		button.addEventListener('click', () => {
			const level = this.levelRepository.get();
			const levelAsJson = JSON.stringify(level);
			const levelAsBase64 = btoa(levelAsJson);

			const url = `http://localhost:5173/?level=${levelAsBase64}`;
			window.open(url, '_blank');
		});

		container.append(button);
	}
}