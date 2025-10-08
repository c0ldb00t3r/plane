/* eslint-disable @typescript-eslint/no-require-imports */
const sharedConfig = require("@plane/tailwind-config/tailwind.config.js");

module.exports = {
  content: {
    files: ["./app/**/*.{js,ts,jsx,tsx}"],
  },
  presets: [sharedConfig],
};
