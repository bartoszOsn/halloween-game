type Constructor<T = any> = new (...args: any[]) => T;

let currentContainer: Container | null = null;

export class Container {
	private readonly typeToConstructor: Map<Constructor, Constructor> = new Map<Constructor, Constructor>();
	private readonly typeToInstance: Map<Constructor, object> = new Map<Constructor, object>();

	constructor() {
	}

	with<T>(type: Constructor<T>, constructor: Constructor<T>): Container {
		this.typeToConstructor.set(type, constructor);
		return this;
	}

	get<T extends object>(type: Constructor<T>): T {
		if (this.typeToInstance.has(type)) {
			return this.typeToInstance.get(type) as T;
		}

		if (this.typeToConstructor.has(type)) {
			return this.instantiate(type);
		}

		throw new Error(`No type registered for ${type.name}`);
	}

	private instantiate<T extends object>(type: Constructor<T>): T {
		if (!this.typeToConstructor.has(type)) {
			throw new Error(`No instance registered for ${type.name}`);
		}
		const constructor = this.typeToConstructor.get(type) as Constructor<T>;

		const prevContainer = currentContainer;
		currentContainer = this;
		const instance = new constructor();
		currentContainer = prevContainer;

		this.typeToInstance.set(type, instance);
		return instance;
	}
}

export function inject<T extends object>(type: Constructor<T>): T {
	if (currentContainer === null) {
		throw new Error(`Not in a scope of a container`);
	}
	return currentContainer.get(type);
}