import type { Config } from "@react-router/dev/config";

const BASENAME = process.env.NEXT_PUBLIC_ADMIN_BASE_PATH || "/";

export default {
  appDirectory: "framework/app",
  basename: BASENAME,
  // Admin runs as a client-side app; build a static client bundle only
  ssr: false,
} satisfies Config;
