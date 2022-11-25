/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import addons, { makeDecorator, useChannel } from '@storybook/addons';
import { RESET, SET } from "@storybook/addon-knobs";
import { OBJECT_TEMPLATE } from './props';

function getKnobValues(knobs: Record<string, { value: any }>) {
    const obj: Record<string, any> = {};

    for (const name in knobs) {
        obj[name] = knobs[name].value;
    }
    return obj;
}

export const preview = (parameter: any) => {
    const channel = addons.getChannel();

    channel.emit("preview", parameter);
};

export function raw(name: string) {
    return new Function(`
        var knobs = arguments[0];

        return knobs[${JSON.stringify(name)}];
    `);
}

export function global(name: string) {
    return new Function(`
        var globals = arguments[1];

        return globals[${JSON.stringify(name)}];
    `);
}


export function previewTemplate(strings: TemplateStringsArray, ...values: any[]) {
    return [strings, values];
}

previewTemplate.object = OBJECT_TEMPLATE;
previewTemplate.raw = raw;
previewTemplate.global = global;

export const withPreview = makeDecorator({
    name: 'withPreview',
    parameterName: 'preview',
    wrapper: (storyFn, context) => {
        const channel = addons.getChannel();

        useChannel({
            [SET]: ({ knobs }) => channel.emit("knobs", getKnobValues(knobs)),
            [RESET]: () => channel.emit("knobs", {}),
        });
        return storyFn(context);
    },
});

export * from "./code/consts";
export { previewFunction, codeIndent, convertGlobalCSS } from "./code/utils";
export * from "./codesandbox/index";
export * from "./props/index";
export * from "./types";
