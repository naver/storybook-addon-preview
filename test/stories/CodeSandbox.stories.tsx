import * as React from "react";
import { DEFAULT_REACT_CODESANDBOX, DEFAULT_VUE3_CODESANDBOX, DEFAULT_VUE_CODESANDBOX } from "../../dist";
import { makeArgs, makeArgType } from "./utils";

export default {
    title: "CodeSandbox",
};

export const ControlsTemplate = (props: Record<string, any>) => {
    return <div>{props.title}</div>;
};

ControlsTemplate.storyName = "Test Controls";

ControlsTemplate.argTypes = {
    title: makeArgType({
        type: "text",
        defaultValue: "Controls Title",
    }),
};
ControlsTemplate.args = {
    ...makeArgs(ControlsTemplate.argTypes),
};



ControlsTemplate.parameters = {
    preview: [
        {
            tab: "css",
            template: (args: Record<string, any>) => {
                return `body {}`;
            },
            language: "css",
            codesandbox: DEFAULT_REACT_CODESANDBOX([], {
                "src/styles.css": { tab: "css" },
            }),
        },
        {
            tab: "React",
            template: (args: Record<string, any>) => {
                return `<div>${args.title}</div>`;
            },
            language: "tsx",
            codesandbox: DEFAULT_REACT_CODESANDBOX([], {
                "src/styles.css": { tab: "css" },
            }),
        },
        {
            tab: "Vue",
            template: (args: Record<string, any>) => {
                return `<div>${args.title}</div>`;
            },
            language: "tsx",
            codesandbox: DEFAULT_VUE_CODESANDBOX([]),
        },
        {
            tab: "Vue3",
            template: (args: Record<string, any>) => {
                return `<div>${args.title}</div>`;
            },
            language: "tsx",
            codesandbox: DEFAULT_VUE3_CODESANDBOX([]),
        },
    ],
};
