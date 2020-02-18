/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import { joinStrs } from "../utils";
import { CodeSandboxTemplate } from "../types";

export const DEFAULT_LIT_CODESANDBOX = (dependencies: string[]) => new Function(`
var previews = arguments[0];
return {
    framework: "lit",
    files: {
        "src/index.ts": previews["Lit"].join("\\n"),
        "src/index.css": previews["CSS"] ? previews["CSS"].join("\\n") : "",
    },
    userDependencies: ${joinStrs(dependencies)},
};`) as CodeSandboxTemplate;
