import { Tool } from './Tool.ts';

export class PointerTool extends Tool {
    get id(): string { return 'pointer'; }
    get name(): string { return 'Pointer'; }
    get icon(): string { return '↖️'; }

    activate(): void {}
    deactivate(): void {}
    update(): void {}
}