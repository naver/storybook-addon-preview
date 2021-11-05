/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import { CodeSandboxTemplate } from "../types";

export const DEFAULT_VUE_CODESANDBOX: CodeSandboxTemplate = (userDependencies = [], files = {}) => {
    return {
        template: "vue-cli",
        files: {
            "src/main.js": `
import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
    render: h => h(App)
}).$mount("#app");
        `,
            "src/App.vue": {
                tab: "Vue",
            },
            ...files,
        },
        dependencies: {
            "vue": "^2.6.0",
        },
        userDependencies,
    };
};
