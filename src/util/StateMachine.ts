export class StateMachine<TState extends string, TProps> {
	private currentState: TState | null = null;
	private currentStateHasDuration: boolean = false;
	private currentProps: TProps;

	constructor(
		private readonly stateConfig: StateMachineConfig<TState, TProps>,
		initialState: TState,
		initialProps: TProps
	) {
		this.currentProps = initialProps;
		this.transitionToState(initialState);
	}

	update() {
		if (this.currentStateHasDuration) {
			return;
		}

		if (!this.currentState) {
			return;
		}

		const newState = this.stateConfig[this.currentState]?.nextState(this.currentProps);
		if (newState && newState !== this.currentState) {
			this.transitionToState(newState);
		}

	}

	updateProps(newProps: Partial<TProps>) {
		this.currentProps = {
			...this.currentProps,
			...newProps
		};
	}

	getCurrentState(): TState | null {
		return this.currentState;
	}

	private transitionToState(newState: TState) {
		const oldState = this.currentState;
		const oldStateConfig = oldState ? this.stateConfig[oldState] : undefined;
		const newStateConfig = this.stateConfig[newState];
		oldStateConfig?.onExit?.();
		this.currentState = newState;
		newStateConfig?.onEnter?.();

		const hasDuration = !!newStateConfig?.resolveEndState;
		if (hasDuration) {
			newStateConfig?.resolveEndState?.(() => {
				this.transitionToState(newStateConfig.nextState(this.currentProps));
			});
		}
		this.currentStateHasDuration = hasDuration;
	}
}

export interface StateConfig<TState extends string, TProps> {
	onEnter?: () => void;
	onExit?: () => void;
	nextState: (props: TProps) => TState;
	resolveEndState?: (end: () => void) => void;
}

export type StateMachineConfig<TState extends string, TProps> = {
	[state in TState]: StateConfig<TState, TProps>;
}