import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "path";

export default defineConfig({
  build: {
    lib: {
      entry: {
        utilsLang: path.resolve(__dirname, "src/utils-lang/index.ts"),
        utilsLog: path.resolve(__dirname, "src/utils-log/index.ts"),
        utilsWebStorage: path.resolve(
          __dirname,
          "src/utils-web-storage/index.ts"
        ),
      },
      formats: ["es"],
      fileName: (_, entryName) => `${entryName}.js`,
    },
    outDir: "dist",
    rollupOptions: {
      external: [],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
      },
    },
    emptyOutDir: true,
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
