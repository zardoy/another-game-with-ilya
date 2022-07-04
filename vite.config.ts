import { defineConfig } from "vite";

import { envHtmlPlugin } from "./envHtmlPlugin";

const defineEnv = (envs: Record<string, string>) => {
    Object.entries(envs)
        .forEach(([name, val]) => {
            if (!process.env[name]) process.env[name] = String(val);
        });
};

defineEnv({
    VITE_NAME: process.env.npm_package_name,
    VITE_BUILD_DATE: new Date().toLocaleDateString(),
    VITE_SCRIPT: "./body/index.ts"
});

export default defineConfig({
    base: "./",
    root: "./src",
    server: {
        port: 7000
    },
    plugins: [
        envHtmlPlugin()
    ]
});
