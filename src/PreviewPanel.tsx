import * as React from "react";
import { useArgs, useParameter, useChannel, useGlobals } from "@storybook/api";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { SyntaxHighlighter } from "@storybook/components";
import addons from "@storybook/addons";

import "react-tabs/style/react-tabs.css";
import "./css/preview.css";

import CodeSandBox from "./CodeSandBox";
import CopyButton from "./CopyButton";
import { getHighlightInfo } from "./utils";
import { ParsedPreviewParameter, PreviewParameter } from "./types";



function processArrayTemplate(
    [strings, values]: any[],
    props: Record<string, any>,
    globals: Record<string, any>,
) {
    return strings.reduce((prev, next, i) => {
        let name = values[i];

        if (typeof name === "undefined") {
            name = "";
        }
        let value: any = name;

        if (name) {
            if (typeof name === "function") {
                try {
                    value = name(props, globals);
                } catch (e) { }
            }
            if (Array.isArray(name)) {
                value = processArrayTemplate(name, props, globals);
            } else if (name in props) {
                value = JSON.stringify(props[name]);
            }
        }
        return prev + next + value;
    }, "");
}

function getInfo(
    options: PreviewParameter,
    props: Record<string, any>,
    globals: Record<string, any>,
): ParsedPreviewParameter {
    const {
        template,
        description = "",
        tab = "Code",
        language = "javascript",
        args,
        knobs,
    } = options;
    const nextProps = { ...props, ...(knobs || {}), ...(args || {}) };

    let text = "";

    if (typeof template === "string") {
        text = template;
    } else if (typeof template === "function") {
        try {
            text = template(nextProps, globals);
        } catch (e) {
            text = "";
        }
    } else if (Array.isArray(template)) {
        text = processArrayTemplate(template, nextProps, globals);
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
    const [globals] = useGlobals();
    const [args] = useArgs();
    const [userKnobs, setKnobs] = React.useState({});
    const [preview, setPreview] = React.useState<object>();
    const [tabIndexInfo, setTabIndexInfo] = React.useState({
        index: 0,
    });
    const previewFormatter = addons.getConfig().previewFormatter;

    const options = [].concat(useParameter("preview", []));
    const panelRef = React.useRef<HTMLDivElement>();
    const props = { ...(userKnobs || {}), ...(args || {}), ...preview };

    useChannel({
        "preview": e => {
            // change preview parameter
            setPreview(e);
        },
        "args": () => {
            // change args parameter
            setPreview({});
        },
        "knobs": e => {
            // change knobs parameter
            setKnobs(e);
            setPreview({});
        },
    });
    const templates = options
        .filter(option => "template" in option)
        .map(option => getInfo(option, props || {}, globals));

    const previews: Array<PreviewParameter & {
        templates: ParsedPreviewParameter[],
    }> = [];

    const previewMap: Record<string, string[]> = {};
    const templateMap: Record<string, ParsedPreviewParameter[]> = {};

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

    for (const name in templateMap) {
        previewMap[name] = templateMap[name].map(template => template.text);
    }
    // Since there may be a missing tab, the index of the tab is forcibly changed.
    tabIndexInfo.index = Math.max(0, Math.min(tabIndexInfo.index, previews.length - 1));
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
    if (!previews.length) {
        return <div className="no-preview">
            <h4 className="no-preview-title">No Preview found</h4>
            <p className="no-preview-description">
                <a href="https://github.com/naver/storybook-addon-preview" target="_blank" rel="noreferrer">
                    Learn how to dynamically create source code previews with controls or knobs
                </a>
            </p>
        </div>;
    }
    return (
        <Tabs className={["react-tabs", "preview-tabs"]} onSelect={index => {
            setTabIndexInfo({
                index,
            });
        }} defaultIndex={tabIndexInfo.index}>
            <TabList>
                {previews.map(({ tab }) => <Tab key={tab}>{tab}</Tab>)}
            </TabList>

            {previews.map(({ codesandbox, tab, templates: previewTemplates }, i) => {
                let nextStartNumber = 1;

                return (<TabPanel key={tab}>
                    <div className="panel" ref={panelRef}>
                        {codesandbox && <CodeSandBox info={typeof codesandbox === "function"
                            ? codesandbox(previewMap)
                            : codesandbox} previews={previewMap} />}
                        {previewTemplates.map(({
                            language,
                            description,
                            copy,
                            text,
                            continue: isContinue,
                            format,
                        }, j) => {
                            if (!isContinue) {
                                nextStartNumber = 1;
                            }
                            const startNumber = nextStartNumber;
                            const {
                                lines: highlightLines,
                                code: nextCode,
                            } = getHighlightInfo(previewFormatter && format ? previewFormatter(format, text) : text);

                            nextStartNumber += nextCode.split("\n").length;
                            return <div className="code-preview" key={j}>
                                {copy && <CopyButton tab={i} index={j} onCopyText={onCopyText} />}
                                {description && <div className="code-description">{description}</div>}
                                <SyntaxHighlighter
                                    language={language}
                                    showLineNumbers={true}
                                    startingLineNumber={startNumber}
                                    format={previewFormatter ? false : format || false}
                                    wrapLines={true}
                                    lineProps={lineNumber => {
                                        const style: Record<string, any> = {
                                            display: "block",
                                        };

                                        if (highlightLines.some(([start, end]) => {
                                            return start <= lineNumber && lineNumber <= end;
                                        })) {
                                            style.backgroundColor = `rgb(219, 255, 219)`;
                                        }
                                        return { style };
                                    }}
                                >{nextCode}</SyntaxHighlighter>
                                <pre className={`language-${language} line-numbers`} style={{
                                    backgroundColor: "transparent",
                                }}><code className={`language-${language} line-numbers`}></code></pre>
                            </div>;
                        })}
                    </div>
                </TabPanel>);
            })}
        </Tabs>
    );
};

export default PreviewPanel;
