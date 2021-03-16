import * as React from "react";
import { withPreview } from "storybook-addon-preview";
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';


export default {
    title: "Storybook Addon Preview",
    decorators: [withKnobs, withPreview],
};

export const Template = () => {
    return <div>{text("title", "Title")}</div>;
};

Template.storyName = "Test Knobs";


Template.parameters = {
    preview: [
        {
            tab: "React",
            template: (knobs: Record<string, any>) => {
                return `<div>${knobs.title}</div>`;
            },
            language: "tsx",
        },
    ],
};
