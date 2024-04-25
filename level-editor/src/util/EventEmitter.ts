export class EventEmitter<T extends Record<string, any>> {
	private readonly listeners = new Map<keyof T, Set<Function>>();

	on<K extends keyof T>(event: K, listener: (payload: T[K]) => void): void {
		if (!this.listeners.has(event)) {
			this.listeners.set(event, new Set());
		}
		this.listeners.get(event)!.add(listener);
	}

	off<K extends keyof T>(event: K, listener: (payload: T[K]) => void): void {
		if (!this.listeners.has(event)) {
			return;
		}
		this.listeners.get(event)!.delete(listener);
	}

	emit<K extends keyof T>(event: K, payload: T[K]): void {
		if (!this.listeners.has(event)) {
			return;
		}
		for (const listener of this.listeners.get(event)!) {
			listener(payload);
		}
	}
}