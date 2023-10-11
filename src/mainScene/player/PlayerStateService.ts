import * as Phaser from 'phaser';
import EventEmitter = Phaser.Events.EventEmitter;
import { inject } from '../../util/Container';

export type PlayerState = 'idle' | 'walking' | 'hurt';

export interface PlayerStateProps {
	leftKeyPressed: boolean;
	rightKeyPressed: boolean;
	facingSide: PlayerFacingSide;
	lastHurtFrom: 'left' | 'right';
}

export enum PlayerFacingSide {
	Right,
	Left
}

export class PlayerStateService extends EventEmitter {
	private readonly scene = inject(Phaser.Scene);

	private state: PlayerState = 'idle';
	private props: PlayerStateProps = {
		leftKeyPressed: false,
		rightKeyPressed: false,
		facingSide: PlayerFacingSide.Right,
		lastHurtFrom: 'left'
	}

	constructor() {
		super();
	}

	update(): void {
		if (this.state === 'hurt') {
			return;
		}

		const newState = this.predictStateBasedOnProps();
		if (newState !== this.state) {
			this.setState(newState);
		}
	}

	updateProps(newProps: Partial<PlayerStateProps>): void {
		this.props = {
			...this.props,
			...newProps
		};
	}

	setHurt(time: number): void {
		this.setState('hurt');
		this.scene.time.delayedCall(time, () => {
			this.setState(this.predictStateBasedOnProps());
		});
	}

	getState(): PlayerState {
		return this.state;
	}

	getProps(): PlayerStateProps {
		return this.props;
	}

	private predictStateBasedOnProps(): PlayerState {
		if (this.props.leftKeyPressed || this.props.rightKeyPressed) {
			return 'walking';
		}
		return 'idle';
	}

	private setState(state: PlayerState): void {
		this.emit(PlayerStateEvent.EXIT_STATE, this.state);
		this.state = state;
		this.emit(PlayerStateEvent.ENTER_STATE, this.state);
	}
}

export enum PlayerStateEvent {
	EXIT_STATE = 'exit-state',
	ENTER_STATE = 'enter-state'
}