import path from "node:path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { reactRouter } from "@react-router/dev/vite";

const PUBLIC_ENV_KEYS = [
  "NEXT_PUBLIC_API_BASE_URL",
  "NEXT_PUBLIC_API_BASE_PATH",
  "NEXT_PUBLIC_ADMIN_BASE_URL",
  "NEXT_PUBLIC_ADMIN_BASE_PATH",
  "NEXT_PUBLIC_SPACE_BASE_URL",
  "NEXT_PUBLIC_SPACE_BASE_PATH",
  "NEXT_PUBLIC_LIVE_BASE_URL",
  "NEXT_PUBLIC_LIVE_BASE_PATH",
  "NEXT_PUBLIC_WEB_BASE_URL",
  "NEXT_PUBLIC_WEB_BASE_PATH",
  "NEXT_PUBLIC_WEBSITE_URL",
  "NEXT_PUBLIC_SUPPORT_EMAIL",
];

const publicEnv = PUBLIC_ENV_KEYS.reduce<Record<string, string>>((acc, key) => {
  acc[key] = process.env[key] ?? "";
  return acc;
}, {});

export default defineConfig(({ isSsrBuild }) => {
  // Only produce an SSR bundle when explicitly enabled.
  // For static deployments (default), we skip the server build entirely.
  const enableSsrBuild = process.env.ADMIN_ENABLE_SSR_BUILD === "true";

  return {
    define: {
      "process.env": JSON.stringify(publicEnv),
    },
    build: {
      assetsInlineLimit: 0,
      sourcemap: process.env.NODE_ENV === 'production' ? 'hidden' : false,
      rollupOptions:
        isSsrBuild && enableSsrBuild
          ? {
            input: path.resolve(__dirname, "server/app.ts"),
          }
          : undefined,
    },
    plugins: [reactRouter(), tsconfigPaths({ projects: [path.resolve(__dirname, "tsconfig.json")] })],
    resolve: {
      alias: {
        // Keep only the next/image compatibility shim; workspace packages should
        // resolve from built artifacts in node_modules.
        "next/image": path.resolve(__dirname, "framework/app/compat/next-image.tsx"),
      },
      // When building inside Docker with pnpm workspaces, symlinks may be used
      // for workspace packages. Preserve them so Vite can resolve their exports
      // correctly instead of attempting to follow to source paths.
      preserveSymlinks: true,
      dedupe: ["react", "react-dom"],
    },
    // No SSR-specific overrides needed; alias resolves to ESM build
  };
});
