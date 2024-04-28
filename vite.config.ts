import { resolve } from 'path'
import { defineConfig } from 'vite';

export default defineConfig(({ mode  }) => {
	const input: Record<string, string> = {
		main: resolve(__dirname, 'index.html')
	}

	if (mode === 'development') {
		input['level-editor'] = resolve(__dirname, 'level-editor.html');
	}

	return {
		build: {
			rollupOptions: {
				input
			}
		}
	};
});