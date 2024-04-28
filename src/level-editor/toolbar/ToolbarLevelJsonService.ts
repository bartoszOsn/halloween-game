import { LevelRepository } from '../LevelRepository.ts';
import { inject } from '../../../src/util/Container.ts';
import { DialogService } from '../util/DialogService.ts';

export class ToolbarLevelJsonService {
	private readonly levelRepository = inject(LevelRepository);
	private readonly dialogService = inject(DialogService);

	init(container: HTMLElement): void {
		const button = document.createElement('button');
		button.innerText = 'See level';
		button.style.width = '100%';
		button.style.padding = '8px';

		button.addEventListener('click', () => {
			const level = this.levelRepository.get();

			const jsonLevel = JSON.stringify(level, null, '\t');

			this.dialogService.showDialog((container, resolve) => {
				container.style.display = 'flex';
				container.style.flexDirection = 'column';

				const textArea = document.createElement('textarea');
				textArea.style.width = '100%';
				textArea.style.flexGrow = '1';
				textArea.value = jsonLevel;
				textArea.readOnly = true;

				container.append(textArea);

				const closeButton = document.createElement('button');
				closeButton.innerText = 'Close';
				closeButton.style.width = '100%';
				closeButton.style.padding = '8px';
				closeButton.addEventListener('click', () => {
					resolve(void 0);
				});

				container.append(closeButton);

				textArea.select();
			})
		});

		container.append(button);
	}
}