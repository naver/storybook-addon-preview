/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import { CodeSandboxTemplate } from "../types";

export const DEFAULT_VUE3_CODESANDBOX: CodeSandboxTemplate = (userDependencies = [], files = {}) => {
    return {
        template: "vue-cli",
        files: {
            "src/main.js": `
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')`,
            "src/App.vue": { tab: "Vue3" },
            ...files,
        },
        dependencies: {
            "vue": "^3.0.0",
        },
        userDependencies,
    };
};
