/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import { joinStrs } from "../utils";
import { CodeSandboxTemplate } from "../types";

export const DEFAULT_VANILLA_CODESANDBOX = (dependencies: string[]) => new Function(`
var previews = arguments[0];
return {
    framework: "vanilla",
    files: {
        "index.html": {
            template: "html",
            html: previews["HTML"],
            cssFiles: ["src/styles.css"],
            jsFiles: ["src/index.ts"],
        },
        "src/styles.css": previews["CSS"][0],
        "src/index.ts": previews["Vanilla"][0],
    },
    userDependencies: ${joinStrs(dependencies)},
};`) as CodeSandboxTemplate;
