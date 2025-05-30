import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  optimizeDeps: {
    include: ["tuicall-engine-wx",'@tencentcloud/tui-core'],
  },
  build: {
    rollupOptions: {
      external: ["tuicall-engine-wx",'@tencentcloud/tui-core'],
    },
  },
});
