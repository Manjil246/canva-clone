import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    global: {},
  },
  // optimizeDeps: {
  //   include: ["aws-sdk"],
  // },
  // build: {
  //   rollupOptions: {
  //     external: ["aws-sdk"],
  //   },
  // },
});
