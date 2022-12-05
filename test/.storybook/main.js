const path = require("path");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    typescript: {
        reactDocgen: "react-docgen-typescript",
        reactDocgenTypescriptOptions: {
            shouldExtractLiteralValuesFromEnum: true,
            propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
        },
    },
    webpackFinal: config => {
        config.module.rules.push({
            test: /\.(ts|tsx)$/,
            loader: 'ts-loader',
            options: {
                // disable type checker - we will use it in fork plugin
                transpileOnly: true
            },
        });
        config.plugins.push(new ForkTsCheckerWebpackPlugin());
        return config;
    },
    stories: [
        "../stories/**/*.stories.@(js|jsx|ts|tsx)"
    ],
    addons: [
        "@storybook/addon-knobs",
        "@storybook/addon-docs/register",
        "@storybook/addon-controls/register",
        "@storybook/addon-viewport/register",
        "storybook-addon-preview/register",
        "storybook-dark-mode/register",
    ],
    "framework": "@storybook/react",
};
