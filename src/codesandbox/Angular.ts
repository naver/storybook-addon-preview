/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import { CodeSandboxTemplate } from "../types";
import { joinStrs } from "../utils";

export const DEFAULT_ANGULAR_CODESANDBOX = (dependencies: string[]) => new Function(`
var previews = arguments[0];
return {
    framework: "angular",
    files: {
        "src/app/app.component.css": previews["CSS"][0],
        "src/app/app.component.html": previews["Angular"][0],
        "src/app/app.component.ts": previews["Angular"][1],
        "src/app/app.module.ts": previews["Angular"][2],
    },
    userDependencies: ${joinStrs(dependencies)},
};`) as CodeSandboxTemplate;
