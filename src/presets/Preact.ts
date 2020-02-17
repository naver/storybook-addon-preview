export const PREACT_PRESET =  {
    dependencies: {
        preact: "latest",
    },
    template: "preact-cli",
    files: {
        "src/index.js": `import { Component, h, render } from "preact";
import App from "./App";
import "./App.css";
render(<App />, document.querySelector("#root"));
`,
    },
};