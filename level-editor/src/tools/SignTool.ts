import { Tool } from './Tool.ts';
import { inject } from '../../../src/util/Container.ts';
import Phaser from 'phaser';
import { worldToTile } from '../../../src/mainScene/tiles/tileToWorld.ts';
import { LevelRepository } from '../LevelRepository.ts';
import { DialogService } from '../util/DialogService.ts';

export class SignTool extends Tool {
	private readonly scene = inject(Phaser.Scene);
	private readonly levelRepository = inject(LevelRepository);
	private readonly dialogService = inject(DialogService);

    get id(): string { return 'sign'; }
    get name(): string { return 'Signs'; }
    get icon(): string { return '🚧'; }

	constructor() {
		super();
		this.handleOnClick = this.handleOnClick.bind(this);
	}

    activate(): void {
		this.scene.input.on('pointerdown', this.handleOnClick);
	}
    deactivate(): void {
		this.scene.input.off('pointerdown', this.handleOnClick);
	}
    update(): void {
    }

	private handleOnClick(): void {
		const x = this.scene.input.activePointer.worldX;
		const y = this.scene.input.activePointer.worldY;
		const tilePos = worldToTile(x, y);

		if (this.scene.input.activePointer.leftButtonDown()) {
			this.showDialog().then((text) => {
				this.levelRepository.addSign(tilePos, text);
			})
		} else if (this.scene.input.activePointer.rightButtonDown()) {
			this.levelRepository.removeSign(tilePos);
		}
	}

	private async showDialog(): Promise<string> {
		return this.dialogService.showDialog<string>((container, resolve) => {
			const textArea = document.createElement('textarea');
			textArea.style.width = '100%';

			const okButton = document.createElement('button');
			okButton.textContent = 'OK';
			okButton.addEventListener('click', () => {
				resolve(textArea.value);
			});

			container.appendChild(textArea);
			container.appendChild(okButton);

			textArea.focus();
		})
	}

}