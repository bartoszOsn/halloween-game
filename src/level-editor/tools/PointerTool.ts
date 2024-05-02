import { Tool } from './Tool.ts';
import { inject } from '../../util/Container.ts';
import { CameraService } from '../CameraService.ts';

export class PointerTool extends Tool {
	private readonly cameraService = inject(CameraService);

    get id(): string { return 'pointer'; }
    get name(): string { return 'Pointer'; }
    get icon(): string { return '↖️'; }

    activate(): void {
		this.cameraService.setUseLeftButton(true);
	}
    deactivate(): void {
		this.cameraService.setUseLeftButton(false);
	}
    update(): void {}
}