import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import reactRefresh from "@vitejs/plugin-react-refresh";
import sass from "sass";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), reactRefresh()],
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass,
      },
    },
  },
});
