/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import { CodeSandboxTemplate } from "../types";

export const DEFAULT_SVELTE_CODESANDBOX: CodeSandboxTemplate = (userDependencies = [], files = {}) => {
    return {
        files: {
            "index.js": `
import App from "./App.svelte";

const app = new App({
    target: document.body
});

export default app;
        `,
            "rollup.config.js": `
// this file will not afect the sandbox but will
// afect the deployment and dowload

import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";

const production = !process.env.ROLLUP_WATCH;

export default {
    input: "index.js",
    output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/bundle.js"
    },
    plugins: [
    svelte({
        // enable run-time checks when not in production
        dev: !production,
        // we'll extract any component CSS out into
        // a separate file — better for performance
        css: css => {
        css.write("public/bundle.css");
        }
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve(),
    commonjs(),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser()
    ]
};
        `,
            "App.svelte": {
                tab: "Svelte",
            },
            ...files,
        },
        dependencies: {
            "svelte": "^3.16.1",
        },
        devDependencies: {
            "npm-run-all": "^4.1.5",
            "rollup": "^1.10.1",
            "rollup-plugin-commonjs": "^9.3.4",
            "rollup-plugin-node-resolve": "^4.2.3",
            "rollup-plugin-svelte": "^5.0.3",
            "rollup-plugin-terser": "^4.0.4",
            "sirv-cli": "^0.3.1",
        },
        userDependencies,
    };
};
