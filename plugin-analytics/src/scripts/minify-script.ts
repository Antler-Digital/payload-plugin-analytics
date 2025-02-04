import esbuild from "esbuild";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Build function
export async function buildScript() {
  try {
    // Ensure the public directory exists in the plugin root
    const publicDir = resolve(__dirname, "../public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    await esbuild.build({
      entryPoints: [resolve(__dirname, "./analytics-client.ts")],
      bundle: true,
      minify: true,
      outfile: resolve(publicDir, "analytics.min.js"),
      format: "iife",
      target: ["es6"],
      platform: "browser",
      sourcemap: true,
    });

    console.log("Analytics script built successfully!");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

buildScript();
