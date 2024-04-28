import { inject } from '../../util/Container.ts';
import { LevelRepository } from '../LevelRepository.ts';

export class ToolbarResetLevelService {
	private readonly levelRepository = inject(LevelRepository);

	init(container: HTMLDivElement): void {
		const button = document.createElement('button');
		button.innerText = 'Reset';
		button.style.width = '100%';
		button.style.padding = '8px';

		button.addEventListener('click', () => {
			this.levelRepository.reset();
		});

		container.append(button);
	}
}