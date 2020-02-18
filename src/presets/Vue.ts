/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
export const VUE_PRESET =  {
    dependencies: {
        "vue": "^2.6.0",
    },
    files: {
        "src/main.js": `
import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
    render: h => h(App)
}).$mount("#app");
        `,
        "public/index.html": `
<!DOCTYPE html>
<html lang="en">
    <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>codesandbox</title>
    </head>
    <body>
    <noscript>
        <strong>We're sorry but codesandbox doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="app"></div>
    <!-- built files will be auto injected -->
    </body>
</html>
        `,
    },
};
