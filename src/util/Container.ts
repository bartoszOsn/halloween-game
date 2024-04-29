type Constructor<T = any> = new (...args: any[]) => T;

let currentContainer: Container | null = null;

export class Container {
	private readonly typeToConstructor: Map<Constructor, Constructor> = new Map<Constructor, Constructor>();
	private readonly typeToValue: Map<Constructor | InjectionToken<unknown>, unknown> = new Map<Constructor, unknown>();

	protected constructor(private readonly parent: Container | null = null) {
		this.withValue(Container, this);
	}

	static create(): Container {
		return new Container();
	}

	child(): Container {
		return new Container(this);
	}

	withValue<T>(token: InjectionToken<T>, value: T): Container;
	withValue<T>(type: Constructor<T>, value: T): Container;
	withValue<T>(typeOrToken: Constructor<T> | InjectionToken<T>, value: T): Container {
		this.typeToValue.set(typeOrToken, value);
		return this;
	}

	withClass<T>(type: Constructor<T>, constructor: Constructor<T>): Container {
		this.typeToConstructor.set(type, constructor);
		return this;
	}

	get<T>(type: Constructor<T>): T;
	get<T>(token: InjectionToken<T>): T;
	get<T>(typeOrToken: Constructor<T> | InjectionToken<T>): T {
		if (this.typeToValue.has(typeOrToken)) {
			return this.typeToValue.get(typeOrToken) as T;
		}

		if (typeOrToken instanceof InjectionToken && !this.parent) {
			if (typeOrToken.defaultValue !== undefined) {
				return typeOrToken.defaultValue;
			}
			throw new Error(`No value registered for ${typeOrToken.name}`);
		}

		if (!(typeOrToken instanceof InjectionToken) &&this.typeToConstructor.has(typeOrToken)) {
			return this.instantiate(typeOrToken);
		}

		if (this.parent) {
			return this.parent.get(typeOrToken);
		} else {
			throw new Error(`No type registered for ${typeOrToken.name}`);
		}

	}

	private instantiate<T>(type: Constructor<T>): T {
		if (!this.typeToConstructor.has(type)) {
			throw new Error(`No instance registered for ${type.name}`);
		}
		const constructor = this.typeToConstructor.get(type) as Constructor<T>;

		const prevContainer = currentContainer;
		currentContainer = this;
		const instance = new constructor();
		currentContainer = prevContainer;

		this.typeToValue.set(type, instance);
		return instance;
	}
}

export function inject<T>(type: Constructor<T>): T;
export function inject<T>(token: InjectionToken<T>): T;
export function inject<T>(typeOrToken: Constructor<T> | InjectionToken<T>): T{
	if (currentContainer === null) {
		throw new Error(`Not in a scope of a container`);
	}
	return currentContainer.get(typeOrToken);
}

export class InjectionToken<T> {
	constructor(public readonly name: string, public readonly defaultValue?: T) {
	}
}

interface ValueRef<T> {
	value: T;
}

const INJECT_FORWARD_EMPTY_SYMBOL = Symbol('INJECT_FORWARD_EMPTY_SYMBOL');

export function injectForward<T>(type: Constructor<T>): ValueRef<T>;
export function injectForward<T>(token: InjectionToken<T>): ValueRef<T>;
export function injectForward<T>(typeOrToken: Constructor<T> | InjectionToken<T>): ValueRef<T> {
	if (currentContainer === null) {
		throw new Error(`Not in a scope of a container`);
	}
	const container = currentContainer;
	let value: T | typeof INJECT_FORWARD_EMPTY_SYMBOL = INJECT_FORWARD_EMPTY_SYMBOL;
	const valueRef: ValueRef<T> = {
		get value() {
			if (value === INJECT_FORWARD_EMPTY_SYMBOL) {
				value = container.get(typeOrToken);
			}
			return value;
		}
	}

	return valueRef;
}