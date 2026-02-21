import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Increase chunk warning limit — large Radix/framer bundles are expected
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split large vendor dependencies into separate cacheable chunks
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-router": ["react-router-dom"],
          "vendor-redux": ["@reduxjs/toolkit", "react-redux", "redux-persist"],
          "vendor-ui": [
            "framer-motion",
            "lucide-react",
            "@radix-ui/react-avatar",
            "@radix-ui/react-dialog",
            "@radix-ui/react-popover",
            "@radix-ui/react-radio-group",
            "@radix-ui/react-select",
          ],
          "vendor-utils": ["axios", "sonner"],
        },
      },
    },
  },
});