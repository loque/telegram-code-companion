import { defineConfig } from "vitest/config";
import type { Plugin } from "vitest/config";

const mdTextPlugin: Plugin = {
  name: "md-text",
  transform(code, id) {
    if (id.endsWith(".md")) {
      return `export default ${JSON.stringify(code)};`;
    }
  },
};

export default defineConfig({
  plugins: [mdTextPlugin],
  test: {
    passWithNoTests: true,
  },
});
