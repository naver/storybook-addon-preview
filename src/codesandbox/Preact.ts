/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import { CodeSandboxTemplate } from "../types";

export const DEFAULT_PREACT_CODESANDBOX: CodeSandboxTemplate = (userDependencies = [], files = {}) => {
    return {
        template: "preact-cli",
        files: {
            "src/index.js": `import { Component, h, render } from "preact";
import App from "./App";
import "./styles.css";

render(<App />, document.querySelector("#root"));
`,
            "src/App.jsx": {
                tab: "Preact",
            },
            "src/styles.css": {
                tab: "CSS",
            },
            ...files,
        },
        dependencies: {
            preact: "latest",
        },
        userDependencies,
    };
};
