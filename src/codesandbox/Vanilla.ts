/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import { CodeSandboxTemplate } from "../types";


export const DEFAULT_VANILLA_CODESANDBOX: CodeSandboxTemplate = (userDependencies = [], files = {}) => {
    return {
        template: "parcel",
        files: {
            "index.html": {
                tab: "HTML",
                template: "html",
                values: {
                    cssFiles: ["src/styles.css"],
                    jsFiles: ["src/index.ts"],
                },
            },
            "src/styles.css": {
                tab: "CSS",
            },
            "src/index.ts": {
                tab: "Vanilla",
            },
            ...files,
        },
        userDependencies,
    };
};
