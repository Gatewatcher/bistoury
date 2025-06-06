import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "path";

export default defineConfig({
  build: {
    lib: {
      entry: {
        hooks: path.resolve(__dirname, "src/hooks/index.ts"),
        "utils-api": path.resolve(__dirname, "src/utils-api/index.ts"),
        "utils-event": path.resolve(__dirname, "src/utils-event/index.ts"),
        "utils-lang": path.resolve(__dirname, "src/utils-lang/index.ts"),
        "utils-log": path.resolve(__dirname, "src/utils-log/index.ts"),
        "utils-tests": path.resolve(__dirname, "src/utils-tests/index.ts"),
        "utils-types": path.resolve(__dirname, "src/utils-types/index.ts"),
        "utils-web-storage": path.resolve(
          __dirname,
          "src/utils-web-storage/index.ts"
        ),
      },
      formats: ["es"],
      fileName: (_, entryName) => `${entryName}/index.js`,
    },
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      external: [],
    },
  },
  plugins: [
    dts({
      entryRoot: "src",
      outputDir: "dist",
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.test.ts"],
  },
});
