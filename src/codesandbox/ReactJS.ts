/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import { CodeSandboxTemplate } from "../types";

export const DEFAULT_REACTJS_CODESANDBOX: CodeSandboxTemplate = (userDependencies = [], files = {}) => {
    return {
        dependencies: {
            react: "^16.8.0",
            "react-dom": "^16.8.0",
            "react-scripts": "^3.4.3",
        },
        template: "create-react-app",
        files: {
            "public/index.html": `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="theme-color" content="#000000">
    <!--
        manifest.json provides metadata used when your web app is added to the
        homescreen on Android. See https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/
    -->
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json">
    <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    <title>React App</title>
</head>

<body>
    <noscript>
        You need to enable JavaScript to run this app.
    </noscript>
    <div id="root"></div>
</body>
</html>
`,

            "src/index.jsx": `import * as ReactDOM from "react-dom";
import * as React from "react";
import App from "./App";
import "./styles.css";

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
`,
            "src/App.jsx": {
                tab: "ReactJS",
            },
            "src/styles.css": {
                tab: "CSS",
            },
            ...files,
        },
        userDependencies,
    };
};
