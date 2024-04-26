export abstract class Tool {
	abstract get id(): string;
	abstract get name(): string;
	abstract get icon(): string;

	abstract activate(): void;
	abstract deactivate(): void;

	abstract update(): void;
}