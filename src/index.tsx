import addons, { makeDecorator } from '@storybook/addons';

export const preview = (parameter: any) => {
    const channel = addons.getChannel();

    channel.emit("preview", parameter);
}
export const withPreview = makeDecorator({
    name: 'withPreview',
    parameterName: 'preview',
    wrapper: (storyFn, context, { parameters }) => {
        const channel = addons.getChannel();

        channel.emit("template", parameters);
        return storyFn(context);
    }
});