/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import { joinStrs } from "../utils";
import { CodeSandboxTemplate } from "../types";

export const DEFAULT_REACT_CODESANDBOX = (dependencies: string[]) => new Function(`
var previews = arguments[0];
return {
    framework: "react",
    files: {
        "src/App.tsx": previews["React"][0],
        "src/styles.css": previews["CSS"][0],
    },
    userDependencies: ${joinStrs(dependencies)},
};`) as CodeSandboxTemplate;
