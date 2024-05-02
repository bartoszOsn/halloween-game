import { inject } from '../util/Container.ts';
import { Point } from '../util/Point.ts';

export class CameraService {
	private readonly scene = inject(Phaser.Scene);

	private startDragPointer: Point | null = null;
	private startDragCamera: Point | null = null;

	private useLeftButton = false;

	create(): void {
		this.scene.input.on('wheel', (_pointer: Phaser.Input.Pointer, _gameObjects: Phaser.GameObjects.GameObject[], _deltaX: number, deltaY: number) => {
			this.scene.cameras.main.zoom -= deltaY * 0.001;
		});

	}

	update(): void {
		const pointer = this.scene.input.activePointer;

		const buttonDown = this.useLeftButton ? pointer.leftButtonDown() : pointer.middleButtonDown();

		if (buttonDown && this.startDragPointer === null) {
			this.startDragPointer = { x: pointer.x, y: pointer.y };
			this.startDragCamera = { x: this.scene.cameras.main.scrollX, y: this.scene.cameras.main.scrollY };
		}

		if (!buttonDown && this.startDragPointer !== null) {
			this.startDragPointer = null;
			this.startDragCamera = null;
		}

		if (this.startDragPointer && this.startDragCamera) {
			const velocity = {
				x: this.startDragPointer.x - pointer.x,
				y: this.startDragPointer.y - pointer.y
			}
			this.scene.cameras.main.scrollX = this.startDragCamera.x + velocity.x / this.scene.cameras.main.zoom;
			this.scene.cameras.main.scrollY = this.startDragCamera.y + velocity.y / this.scene.cameras.main.zoom;
		}
	}

	setUseLeftButton(useLeftButton: boolean): void {
		this.useLeftButton = useLeftButton;
	}
}