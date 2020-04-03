/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import addons, { makeDecorator } from '@storybook/addons';
import * as registerKnobs from "@storybook/addon-knobs/dist/registerKnobs";
import { OBJECT_TEMPLATE } from './props';

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

export function raw(name: string) {
    return new Function(`
        var knobs = arguments[0];

        return knobs[${JSON.stringify(name)}];
    `);
}

export function previewTemplate(strings: TemplateStringsArray, ...values: any[]) {
    return [strings, values];
}

previewTemplate.object = OBJECT_TEMPLATE;
previewTemplate.raw = raw;

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
export * from "./types";
