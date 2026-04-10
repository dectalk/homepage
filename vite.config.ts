import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  plugins: [
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
    reactRouter(),
    tsconfigPaths(),
    {
      name: "configure-response-headers",
      configureServer: server => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          next();
        });
      },
    },
  ],
  assetsInclude: ["**/*.gba"],
  optimizeDeps: {
    exclude: ["@thenick775/mgba-wasm"],
  },
  build: {
    sourcemap: true,
  },
});
