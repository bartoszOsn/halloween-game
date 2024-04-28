export class DialogService {
	showDialog<T>(callback: (container: HTMLDivElement, resolve: (value: T) => void) => void): Promise<T> {
		return new Promise((resolvePromise) => {
			const container = document.createElement("div")
			container.style.position = "fixed"
			container.style.left = "25%";
			container.style.top = "25%";
			container.style.right = "25%";
			container.style.bottom = "25%";
			container.style.backgroundColor = "white"
			container.style.border = "1px solid black"
			container.style.padding = "16px"
			container.style.zIndex = "99999999";
			container.style.overflowY = "auto";
			container.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)"

			document.body.appendChild(container)
			callback(container, (value) => {
				resolvePromise(value)
				document.body.removeChild(container)
			})
		})
	}
}