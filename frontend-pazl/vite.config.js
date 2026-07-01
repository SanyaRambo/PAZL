import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
	const isDev = mode !== 'production';

	return {
		plugins: [
			react({
				babel: {
					plugins: isDev ? ['check-prop-types'] : [],
				},
			}),
		],
		server: {
			host: '0.0.0.0',
			port: 5173,
			proxy: {
				'/uploads': 'http://localhost:3001',
				'/api': {
					target: 'http://localhost:3001',
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ''),
				},
			},
		},
	};
});
