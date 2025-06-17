import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    dts({
      entryRoot: 'src',
      outDir: 'dist',
    }),
    tsconfigPaths(),
    react(),
  ],
  build: {
    lib: {
      entry: {
        hooks: path.resolve(__dirname, 'src/hooks/index.ts'),
        'utils-api': path.resolve(__dirname, 'src/utils-api/index.ts'),
        'utils-date': path.resolve(__dirname, 'src/utils-date/index.ts'),
        'utils-dom': path.resolve(__dirname, 'src/utils-dom/index.ts'),
        'utils-event': path.resolve(__dirname, 'src/utils-event/index.ts'),
        'utils-lang': path.resolve(__dirname, 'src/utils-lang/index.ts'),
        'utils-log': path.resolve(__dirname, 'src/utils-log/index.ts'),
        'utils-react': path.resolve(__dirname, 'src/utils-react/index.ts'),
        'utils-tests': path.resolve(__dirname, 'src/utils-tests/index.ts'),
        'utils-types': path.resolve(__dirname, 'src/utils-types/index.ts'),
        'utils-url': path.resolve(__dirname, 'src/utils-url/index.ts'),
        'utils-web-storage': path.resolve(
          __dirname,
          'src/utils-web-storage/index.ts',
        ),
      },
      fileName: (format, entryName) => `${entryName}/index.${format}.js`,
    },
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: ['react'],
      output: {
        globals: {
          react: 'React',
        },
      },
    },
  },
});
