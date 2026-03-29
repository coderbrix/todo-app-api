import { defineConfig } from "tsup";
import { execSync } from "child_process";

export default defineConfig({
  entry: ["src/**/*.ts"],
  format: ["esm"],
  outDir: "dist",
  clean: true,
  esbuildOptions(options) {
    options.loader = {
      ...options.loader,
      ".hbs": "file", // tells tsup to copy files instead of bundling
    };
  },
  onSuccess: async () => {
    execSync("cp -r src/infrastructure/mailer/templates/*.hbs dist/infrastructure/mailer/templates/", {
      stdio: "inherit",
    });
  },
});
