/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
export const PREACT_PRESET =  {
    dependencies: {
        preact: "latest",
    },
    template: "preact-cli",
    files: {
        "src/index.js": `import { Component, h, render } from "preact";
import App from "./App";
import "./styles.css";

render(<App />, document.querySelector("#root"));
`,
    },
};
