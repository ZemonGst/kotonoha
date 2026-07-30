import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.ts"],
  noExternal: [/^@repo\//],
  // Native addons (.node binaries) cannot be bundled — keep them external.
  // They will be installed by npm/pnpm at deploy time.
  external: ["bcrypt", "pg"],
  splitting: false,
  bundle: true,
  outDir: "./dist",
  clean: true,
  env: { IS_SERVER_BUILD: "true" },
  loader: { ".json": "copy" },
  minify: true,
  sourcemap: false,
});
