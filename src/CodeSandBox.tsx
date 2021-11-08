/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as React from "react";
import { getParameters } from "codesandbox/lib/api/define";
import { CodeSandboxValue } from ".";

export function previewCodeSandBoxHTML(html: string, params?: {
    cssFiles?: string[];
    jsFiles?: string[];
}) {
    const {
        cssFiles = [],
        jsFiles = [],
    } = params || {};
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

export function getCodeSandBox(param: CodeSandboxValue, previews: Record<string, string[]>) {
    const {
        template,
        files = {},
        dependencies,
        devDependencies,
        userDependencies = [],
        scripts,
    } = param;

    const obj: {
        [key: string]: any;
    } = {
        "package.json": {
            content: {
                dependencies: {
                    ...(dependencies || {}),
                },
                devDependencies: {
                    ...(devDependencies || {}),
                },
            },
        },
    };
    const packageDendencies = obj["package.json"].content.dependencies;
    userDependencies.forEach(userModule => {
        const result = /^(@*[^@]+)@*([^@/]+)*$/g.exec(userModule);
        const name = result ? result[1] : userModule;
        const version = result && result[2] ? result[2] : "latest";
        packageDendencies[name] = version;
    });
    if (scripts) {
        obj["package.json"].content.scripts = scripts;
    }
    if (template) {
        obj["sandbox.config.json"] = {
            content: {
                template,
            },
        };
    }
    for (const fileName in files) {
        let content = files[fileName];

        if (content === null) {
            continue;
        }
        if (typeof content === "object") {
            const tabName = content.tab;
            const index = content?.index ?? -1;
            const texts = previews[tabName] || [];
            let text = "";

            if (index > -1) {
                text = texts[index] || "";
            } else {
                text = texts.join("\n");
            }
            if (content.template === "html") {
                text = previewCodeSandBoxHTML(text, content.values);
            }
            content = text;
        }
        obj[fileName] = {
            content,
        };
    }
    return getParameters({
        files: obj,
    });
}

export default function CodeSandBox({ info, previews }: {
    info: CodeSandboxValue;
    previews: Record<string, string[]>;
}) {
    const parameters = getCodeSandBox(info, previews);
    return (
        <form action="https://codesandbox.io/api/v1/sandboxes/define" method="POST" target="_blank">
            <input type="hidden" name="parameters" value={parameters} />
            <input type="submit" value="Open SandBox" />
        </form>);
}
