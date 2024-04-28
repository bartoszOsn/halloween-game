import { LevelRepository } from '../LevelRepository.ts';
import { inject } from '../../../src/util/Container.ts';
import { LevelMessagePayload } from '../../../src/LevelMessagePayload.ts';

export class ToolbarPreviewService {
	private readonly levelRepository = inject(LevelRepository);

	init(container: HTMLElement): void {
		const button = document.createElement('button');
		button.innerText = 'Preview';
		button.style.width = '100%';
		button.style.padding = '8px';

		button.addEventListener('click', () => {
			const level = this.levelRepository.get();

			const url = `http://localhost:5173/?level`;
			const newWindow = window.open(url, '_blank');
			window.addEventListener('message', (e) => {
				if (e.data.type !== 'levelRequested') {
					return;
				}
				newWindow?.postMessage({
					type: 'levelSent',
					level: level
				} satisfies LevelMessagePayload, '*');
			}, { once: true })
		});

		container.append(button);
	}
}