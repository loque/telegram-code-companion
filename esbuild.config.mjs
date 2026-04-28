import { mkdirSync, rmSync } from "node:fs";

import { build } from "esbuild";

const outdir = "dist";

rmSync(outdir, { force: true, recursive: true });
mkdirSync(outdir, { recursive: true });

await build({
  banner: {
    js: "#!/usr/bin/env node",
  },
  bundle: true,
  entryPoints: ["src/main.ts"],
  format: "cjs",
  loader: {
    ".md": "text",
  },
  outfile: "dist/main.cjs",
  platform: "node",
  target: "node20",
});
