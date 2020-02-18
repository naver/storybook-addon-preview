/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import { joinStrs } from "../utils";
import { CodeSandboxTemplate } from "../types";

export const DEFAULT_SVELTE_CODESANDBOX = (dependencies: string[]) => new Function(`
var previews = arguments[0];
return {
    framework: "svelte",
    files: {
        "App.svelte": previews["Svelte"].join("\\n"),
    },
    userDependencies: ${joinStrs(dependencies)},
};`) as CodeSandboxTemplate;
