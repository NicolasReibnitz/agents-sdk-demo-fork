import { defineConfig } from 'vite';

process.env.BROWSER = 'google chrome canary';

export default defineConfig({
	root: './src',
	base: './',
	build: {
		outDir: '../dist',
		emptyOutDir: true
		// rollupOptions: {
		// 	output: {
		// 		entryFileNames: 'assets/[name].js',
		// 		chunkFileNames: 'assets/[name].js',
		// 		assetFileNames: 'assets/[name].[ext]'
		// 	}
		// }
	},
	server: {
		open: '/index.html',
		hmr: {
			// host: 'beep-boop-extra.com',
			host: 'localhost',
			protocol: 'ws'
			// port: 443
		}
		// https: {
		// 	key: '/Users/brandon/.config/valet/Certificates/localhost.key',
		// 	cert: '/Users/brandon/.config/valet/Certificates/localhost.crt'
		// }
	}
});
