import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";

export default defineConfig({
  base: "/wisdom-project/",
  plugins: [wasm()],
});
