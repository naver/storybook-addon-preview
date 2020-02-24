/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import addons, { makeDecorator } from '@storybook/addons';
import * as registerKnobs from "@storybook/addon-knobs/dist/registerKnobs";

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
    return new Function(`
        var p = arguments[0];
        var strings = ${JSON.stringify(strings)};
        var values = ${JSON.stringify(values)};

        function space(indent) {
            var text = [];
            for (var i = 0; i < indent; ++i) {
                text.push(" ");
            }
            return text.join("");
        }
        function toObject(info, names) {
            var quote = info.quote;
            var indent = info.indent;
            var endIndent = info.endIndent;
            var separator = info.separator;
            var joinSeparator = info.joinSeparator;
            var endSeparator = info.endSeparator;
            var objs = ["{"];
            var length = names.length;

            names.forEach(function (n, i) {
                var v = p[n];

                v = JSON.stringify(v);

                objs.push(space(indent) + n + ": " + v  + (i + 1 === length ? endSeparator : separator));
            });
            objs.push(space(endIndent) + "}");
            return objs.join(joinSeparator);
        }
        var dirty = strings.reduce(function (prev, next, i) {
            var name = values[i];

            if (typeof name === "undefined") {
                name = "";
            }
            var value = name;

            if (Array.isArray(name)) {
                var info = name[0];
                var names = name.slice(1);

                if (info.type === "object") {
                    value = toObject(info, names);
                }
            } else if (name in p) {
                value = p[name];
            }

            if (typeof value === "object") {
                value = JSON.stringify(value);
            }
            return "" + prev + next  + value;
        }, "");
        return dirty;
    `);
}

previewTemplate.object = (props: any[], options: any = {}) => {
    const {
        indent = 4,
        endIndent = indent - 4,
        joinSeparator = "\n",
        separator = ",",
        endSeparator = separator,
    } = options;
    return [{
        type: "object",
        endIndent,
        indent,
        joinSeparator,
        separator,
        endSeparator,
    }, ...props];
}

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
export * from "./codesandbox/Angular";
export * from "./codesandbox/Lit";
export * from "./codesandbox/React";
export * from "./codesandbox/Svelte";
export * from "./codesandbox/Vanilla";
export * from "./codesandbox/VanillaJS";
export * from "./codesandbox/Vue";
