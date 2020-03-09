/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import addons, { makeDecorator } from '@storybook/addons';
import * as registerKnobs from "@storybook/addon-knobs/dist/registerKnobs";
import { ObjectType, OptionsType } from "./types";
import { optionsTemplate } from './utils';

function getKnobs() {
    const knobs = registerKnobs.manager.knobStore.getAll();
    const obj = {};

    for (const name in knobs) {
        obj[name] = knobs[name].value;
    }
    return obj;
}

export const preview = (parameter: any) => {
    const channel = addons.getChannel();

    channel.emit("preview", parameter);
}

export function previewTemplate(strings: TemplateStringsArray, ...values: any[]) {
    return [strings, values];
}

previewTemplate.object = (props: any[], options: ObjectType = {}) => {
    return optionsTemplate(
        props,
        {
            prefix: "{",
            suffix: "}",
            ...options,
        },
    );
}
previewTemplate.options = optionsTemplate;

export const withPreview = makeDecorator({
    name: 'withPreview',
    parameterName: 'preview',
    wrapper: (storyFn, context) => {
        const channel = addons.getChannel();

        requestAnimationFrame(() => {
            channel.emit("knobs", getKnobs());
        });
        return storyFn(context);
    },
});
export * from "./code/consts";
export { previewFunction, codeIndent, convertGlobalCSS } from "./code/utils";
export * from "./codesandbox/index";
export * from "./props/index";
