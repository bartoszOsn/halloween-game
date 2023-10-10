import { StateMachine } from '../../src/util/StateMachine';

describe('StateMachine', () => {
	it('should transition to the next state when the current state has a duration', (done) => {
		const stateMachine = new StateMachine({
			one: {
				nextState: () => 'two',
				resolveEndState: (end) => {
					setTimeout(end, 10);
				}
			},
			two: {
				nextState: () => 'one',
				onEnter: () => {
					expect(stateMachine.getCurrentState()).toBe('two');
					done();
				}
			},
		}, 'one', {});

		expect.assertions(2);
		expect(stateMachine.getCurrentState()).toBe('one');
	});

	it('should transition to the next state when the current state does not have a duration', () => {
		const stateMachine = new StateMachine({
			one: {
				nextState: () => 'two'
			},
			two: {
				nextState: () => 'one',
			}
		}, 'one', {});

		expect(stateMachine.getCurrentState()).toBe('one');
		stateMachine.update();
		expect(stateMachine.getCurrentState()).toBe('two');
		stateMachine.update();
		expect(stateMachine.getCurrentState()).toBe('one');
	});
});