import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    reactRouter(),
    tsconfigPaths(),
  ],
  assetsInclude: ["**/*.gba"],
  optimizeDeps: {
    exclude: ["@thenick775/mgba-wasm"],
  },
  build: {
    sourcemap: true,
  },
});
