import * as React from "react";
import { makeArgs, makeArgType } from "./utils";

export default {
    title: "Storybook Addon Preview",
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
            tab: "React",
            template: (args: Record<string, any>) => {
                return `<div>${args.title}</div>`;
            },
            language: "tsx",
        },
    ],
};
