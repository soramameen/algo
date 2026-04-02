import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

export default defineConfig({
  base: isGitHubPages ? "/algo/" : "/",
  plugins: [react()]
});
