/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import { joinStrs } from "../utils";
import { CodeSandboxTemplate } from "../types";

export const DEFAULT_VANILLAJS_CODESANDBOX = (dependencies: string[]) => new Function(`
var previews = arguments[0];
return {
    framework: "vanilla",
    files: {
        "index.html": {
            template: "html",
            html: previews["HTML"],
            cssFiles: ["src/styles.css"],
            jsFiles: ["src/index.js"],
        },
        "src/styles.css": previews["CSS"][0],
        "src/index.js": previews["Vanilla"][0],
    },
    userDependencies: ${joinStrs(dependencies)},
};`) as CodeSandboxTemplate;
