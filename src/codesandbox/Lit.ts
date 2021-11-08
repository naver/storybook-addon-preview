/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import { CodeSandboxTemplate } from "../types";

export const DEFAULT_LIT_CODESANDBOX: CodeSandboxTemplate = (userDependencies = [], files = {}) => {
    return {
        files: {
            "src/index.ts": {
                tab: "Lit",

            },
            "src/index.css": {
                tab: "CSS",
            },
            ...files,
        },
        userDependencies,
    };
};
