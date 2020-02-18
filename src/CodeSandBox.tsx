/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as React from "react";
import { getParameters } from "codesandbox/lib/api/define";
import { VANILLA_PRESET } from "./presets/Vanilla";
import { REACT_PRESET } from "./presets/React";
import { PREACT_PRESET } from "./presets/Preact";
import { ANGULAR_PRESET } from "./presets/Angular";
import { SVELTE_PRESET } from "./presets/Svelte";
import { VUE_PRESET } from "./presets/Vue";
import { LIT_PRESET } from "./presets/Lit";


const presets = {
    "react": REACT_PRESET,
    "preact": PREACT_PRESET,
    "angular": ANGULAR_PRESET,
    "svelte": SVELTE_PRESET,
    "vue": VUE_PRESET,
    "lit": LIT_PRESET,
    "vanilla": VANILLA_PRESET,
};
export function previewCodeSandBoxHTML(params: {
    html: string,
    cssFiles: string[],
    jsFiles: string[],
}) {
    const { html, cssFiles, jsFiles } = params;
    return `<html>
<head>
    <title>Parcel Sandbox</title>
    <meta charset="UTF-8" />
${cssFiles.map(file => `
    <link rel="stylesheet" type="text/css" href="${file}" />`)}
</head>

<body>
${html}
${jsFiles.map(file => `
<script src="${file}"></script>`)}
</body>
</html>`;
}

export function getCodeSandBox(param: { framework: string, files: { [key: string]: any }, userDependencies: string[] }) {
    const { framework, files = {}, userDependencies = [] } = param;
    const {
        dependencies,
        devDependencies,
        template,
        files: presetFiles,
    } = presets[framework];

    const obj: {
        [key: string]: any;
    } = {
        "package.json": {
            content: {
                dependencies: {
                    ...(dependencies || {}),
                },
            },
        },
    };
    if (devDependencies) {
        obj["package.json"].content.devDependencies = {
            ...devDependencies,
        };
    }
    const packageDendencies = obj["package.json"].content.dependencies;
    userDependencies.forEach(userModule => {
        const result = /^(@*[^@]+)@*([^@/]+)*$/g.exec(userModule);
        const name = result ? result[1] : userModule;
        const version = result && result[2] ? result[2] : "latest";
        packageDendencies[name] = version;
    });
    if (template) {
        obj["sandbox.config.json"] = {
            content: {
                template,
            },
        };
    }
    for (const fileName in presetFiles) {
        obj[fileName] = {
            content: presetFiles[fileName],
        }
    }
    for (const fileName in files) {
        let content = files[fileName];

        if (typeof content === "object") {
            const contentTemplate = content.template;

            if (contentTemplate === "html") {
                content = previewCodeSandBoxHTML(content);
            }
        }
        obj[fileName] = {
            content,
        };
    }
    return getParameters({
        files: obj,
    });

};

export default function CodeSandBox({ info }) {
    const parameters = getCodeSandBox(info);
    return (
        <form action="https://codesandbox.io/api/v1/sandboxes/define" method="POST" target="_blank">
            <input type="hidden" name="parameters" value={parameters} />
            <input type="submit" value="Open SandBox" />
        </form>);
};
