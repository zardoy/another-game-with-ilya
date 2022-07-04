import { Plugin } from "vite";

//@ts-ignore
const env = process.env;

export const envHtmlPlugin = (): Plugin => {
    return {
        name: "env-html",
        transformIndexHtml: html => {
            return html.replace(/%(\w+)%/g, (match, key) => {
                // add warn to get notified
                if (!key.startsWith("VITE_")) return match;
                const envValue = process.env[key];
                if (envValue) return envValue;
                return match;
            });
        }
    };
};
