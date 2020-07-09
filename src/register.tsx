/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as React from "react";
import { addons, types } from "@storybook/addons";
import { useChannel, useParameter } from "@storybook/api";
import { AddonPanel } from "@storybook/components";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import * as Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/themes/prism.css";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/line-highlight/prism-line-highlight";
import "prismjs/plugins/line-highlight/prism-line-highlight.css";
import "./preview.css";

import CodeSandBox from "./CodeSandBox";
import CopyButton from "./CopyButton";
import { getHighlightInfo } from "./utils";

function processArrayTemplate([strings, values]: any[], knobs: { [key: string]: any }) {
    return strings.reduce((prev, next, i) => {
        let name = values[i];

        if (typeof name === "undefined") {
            name = "";
        }
        let value: any = name;

        if (name) {
            if (typeof name === "function") {
                try {
                    value = name(knobs);
                } catch (e) { }
            }
            if (Array.isArray(name)) {
                value = processArrayTemplate(name, knobs);
            } else if (name in knobs) {
                value = JSON.stringify(knobs[name]);
            }
        }
        return prev + next + value;
    }, "");
}
function getInfo(options, preview) {
    const {
        template,
        description = "",
        tab = "Code",
        language = "javascript",
    } = options;
    let text = "";

    if (typeof template === "string") {
        text = template;
    } else if (typeof template === "function") {
        try {
            text = template(preview);
        } catch (e) {
            text = "";
        }
    } else if (Array.isArray(template)) {
        text = processArrayTemplate(template, preview);
    }

    return {
        ...options,
        description,
        text: (text || "").trim(),
        tab,
        language,
    };
}

const PreviewPanel = () => {
    const [userKnobs, setKnobs] = React.useState({});
    const [preview, setPreview] = React.useState<object>();
    const [defaultTabIndex, setTabIndex] = React.useState(-1);
    const options = [].concat(useParameter("preview", []));
    const panelRef = React.useRef<HTMLDivElement>();
    const knobs = { ...userKnobs, ...preview };

    useChannel({
        "preview": e => {
            setPreview(e);
        },
        "knobs": e => {
            setKnobs(e);
            setPreview(undefined);
        },
    });
    options.forEach(o => {
        const optionKnobs = o.knobs;
        if (optionKnobs) {
            for (const name in optionKnobs) {
                knobs[name] = optionKnobs[name];
            }
        }
    });
    const templates = options
        .filter(option => "template" in option)
        .map(option => getInfo(option, knobs || {}));

    const previews = [];
    const templateMap = {};

    templates.forEach(template => {
        const { tab, codesandbox } = template;
        if (!templateMap[tab]) {
            templateMap[tab] = [];
            previews.push({
                codesandbox,
                tab,
                templates: templateMap[tab],
            });
        }
        templateMap[tab].push(template);
    });

    const previewMap = {};

    for (const name in templateMap) {
        previewMap[name] = templateMap[name].map(template => template.text);
    }
    const tabIndex = Math.max(0, Math.min(defaultTabIndex, previews.length - 1));
    const onCopyText = (tab: number, index: number) => {
        const copyPreview = previews[tab];

        if (!copyPreview) {
            return "";
        }
        const texts: string[] = [];

        copyPreview.templates.slice(index).every((template, i) => {
            if (i > 0 && !template.continue) {
                return false;
            }
            const text = template.text;

            if (text) {
                texts.push(text);
            }
            return true;
        });

        return texts.join("\n");
    };
    React.useEffect(() => {
        const panelElement = panelRef.current;

        if (!panelElement) {
            return;
        }
        const codeElements = [].slice.call(panelElement.querySelectorAll("pre code"));
        const p = previews[tabIndex];
        if (!p) {
            codeElements.forEach(codeElement => {
                codeElement.innerHTML = "";
            });
            return;
        }
        let startNumber = 1;

        codeElements.forEach((codeElement, i) => {
            const template = p.templates[i];
            const text = template.text || "";
            const code = text.replace(/</g, "&lt;");

            if (!template.continue) {
                startNumber = 1;
            }
            const {
                lines: highlightLines,
                code: nextCode,
            } = getHighlightInfo(code);


            const preElement = codeElement.parentElement;
            preElement.setAttribute("data-start", startNumber);
            preElement.setAttribute("data-line", highlightLines.join(","));
            codeElement.innerHTML = nextCode;

            Prism.highlightElement(codeElement);
            startNumber += code.split("\n").length;
        });
    });
    if (!previews.length) {
        return <div className="no-preview">
            <h4 className="no-preview-title">No Preview found</h4>
            <p className="no-preview-description">
                <a href="https://github.com/naver/storybook-addon-preview" target="_blank">Learn how to dynamically create source code previews with knobs</a>
            </p>
        </div>
    }
    return (
        <Tabs className={["react-tabs", "preview-tabs"]} onSelect={index => {
            setTabIndex(index);
        }}>
            <TabList>
                {previews.map(({ tab }) => <Tab key={tab}>{tab}</Tab>)}
            </TabList>

            {previews.map(({ codesandbox, tab, templates: previewTemplates }, i) => {
                return (<TabPanel key={tab}>
                    <div className="panel" ref={panelRef}>
                        {codesandbox && <CodeSandBox info={typeof codesandbox === "function" ? codesandbox(previewMap) : codesandbox} />}
                        {previewTemplates.map(({ language, description, copy }, j) => {
                            return <div className="code-preview" key={j}>
                                {copy && <CopyButton tab={i} index={j} onCopyText={onCopyText} />}
                                {description && <div className="code-description">{description}</div>}
                                <pre className={`language-${language} line-numbers`} style={{
                                    backgroundColor: "transparent",
                                }}><code className={`language-${language} line-numbers`}></code></pre>
                            </div>
                        })}
                    </div>
                </TabPanel>);
            })}
        </Tabs>
    );
};


addons.register("naver/storyboook-addon-preview", api => {
    addons.add("naver/storyboook-addon-preview/panel", {
        title: "Code Preview",
        type: types.PANEL,
        paramKey: "preview",
        render: ({ active, key }) => (
            <AddonPanel active={active} key={key} >
                <PreviewPanel />
            </AddonPanel>
        ),
    });
});


