import * as React from "react";
import { getParameters } from "codesandbox/lib/api/define";
import PRESET_ANGULAR from "./presets/Angular";
import PRESET_REACT from "./presets/React";
import PRESET_PREACT from "./presets/Preact";
import PRESET_VUE from "./presets/Vue";
import PRESET_SVELTE from "./presets/Svelte";
import PRESET_LIT from "./presets/Lit";


const presets = {
    "react": PRESET_REACT,
    "preact": PRESET_PREACT,
    "angular": PRESET_ANGULAR,
    "svelte": PRESET_SVELTE,
    "vue": PRESET_VUE,
    "lit": PRESET_LIT,
    "vanilla": {
        template: "parcel",
    },
    
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
            const template = content.template;

            if (template === "html") {
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