import { Container, inject, InjectionToken } from '../../src/util/Container';

describe('Container', () => {
	let container: Container = new Container();

	beforeEach(() => {
		container = new Container();
	});

	it('should provide instance', () => {
		// given
		class BaseClass {
			public name: string = 'BaseClass';
		}

		class SubClass extends BaseClass {
			public name: string = 'SubClass';
		}

		container.with(BaseClass, SubClass);

		// when
		const instance = container.get(BaseClass);

		// then
		expect(instance).toBeInstanceOf(SubClass);
	});

	it('should provide instance with dependencies', () => {
		// given
		class Dependency {
			public name: string = 'Dependency';
		}

		class Service {
			readonly dependency = inject(Dependency);
		}

		container.with(Dependency, Dependency)
			.with(Service, Service);

		// when
		const instance = container.get(Service);

		// then
		expect(instance).toBeInstanceOf(Service);
		expect(instance.dependency).toBeInstanceOf(Dependency);
	});

	it('should provide instance with dependencies with dependencies', () => {
		// given
		class DeepDependency {
			public name: string = 'DeepDependency';
		}

		class Dependency {
			readonly deepDependency = inject(DeepDependency);
		}

		class Service {
			readonly dependency = inject(Dependency);
		}

		container.with(DeepDependency, DeepDependency)
			.with(Dependency, Dependency)
			.with(Service, Service);

		// when
		const instance = container.get(Service);

		// then
		expect(instance).toBeInstanceOf(Service);
		expect(instance.dependency).toBeInstanceOf(Dependency);
		expect(instance.dependency.deepDependency).toBeInstanceOf(DeepDependency);
	});

	it('should cache instances', () => {
		class DeepDependency {
			public name: string = 'DeepDependency';
		}

		class Dependency {
			readonly deepDependency = inject(DeepDependency);
		}

		class Service {
			readonly deepDependency = inject(DeepDependency);
			readonly dependency = inject(Dependency);
		}

		container.with(DeepDependency, DeepDependency)
			.with(Dependency, Dependency)
			.with(Service, Service);

		// when
		const instance = container.get(Service);

		// then
		expect(instance).toBeInstanceOf(Service);
		expect(instance.dependency).toBeInstanceOf(Dependency);
		expect(instance.dependency.deepDependency).toBeInstanceOf(DeepDependency);
		expect(instance.deepDependency).toBe(instance.dependency.deepDependency);
	});

	it('should throw error when no instance registered', () => {
		// given
		class BaseClass {
			public name: string = 'BaseClass';
		}

		// when
		const fn = () => container.get(BaseClass);

		// then
		expect(fn).toThrowError('No type registered for BaseClass');
	});

	it('should throw error when using inject outside of scope of container', () => {
		// given
		class Dependency {
			public name: string = 'Dependency';
		}

		class Service {
			readonly dependency = inject(Dependency);
		}

		container.with(Dependency, Dependency)
			.with(Service, Service);

		// when
		const fn = () => inject(Service);

		// then
		expect(fn).toThrowError('Not in a scope of a container');
	});

	it('should inject by tokens', () => {
		// given
		const Token = new InjectionToken<number>('Token');
		const tokenValue = 42;

		container.with(Token, tokenValue);

		// when
		const value = container.get(Token);

		// then
		expect(value).toBe(tokenValue);
	})
});