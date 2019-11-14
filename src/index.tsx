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
export function previewTemplate(strings: string[], ...values: string[]) {
    return new Function(`
        var p = arguments[0];
        var strings = ${JSON.stringify(strings)};
        var values = ${JSON.stringify(values)};
        var dirty = strings.reduce(function (prev, next, i) {
            var name = values[i];
            if (typeof name === "undefined") {
                name = "";
            }
            var value = name in p ? p[name] : name;

            if (Array.isArray(value)) {
                value = "[" + value.join(", ") + "]";
            } else if (typeof value === "object") {
                value = JSON.stringify(value);
            }
            return "" + prev + next  + value;
        }, "");
        return dirty;
    `);
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
    }
});