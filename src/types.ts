import { previewTemplate } from "./index";

/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
export interface CodeSandboxValue {
    template?: string;
    scripts?: Record<string, any>;
    files: FilesParam;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    userDependencies?: string[];
}
export type CodeSandboxTemplate = (userDependencies?: string[], files?: FilesParam) => CodeSandboxValue;

export type FilesParam = Record<string, string | CodeFileTab | null>;
export interface CodeFileTab {
    tab: string;
    index?: number;
    template?: string;
    values?: Record<string, any>;
}
export interface ObjectType {
    indent?: number;
    endIndent?: number;
    joinSeparator?: string;
    separator?: string;
    endSeparator?: string;
}
export interface OptionsType extends ObjectType {
    template?: (name: string, index: number) => any[],
    prefix?: string,
    suffix?: string,
}

export interface PropsOptions {
    indent?: number;
    wrap?: string;
    prefix?: string;
}

/**
 * @typedef
 */
export interface PreviewParameter {
    /**
     * The name of the tab to appear in the preview panel
     */
    tab?: string;
    /**
     * Code to appear in the corresponding tab of the preview panel.
     */
    template?: string
    | ((props: Record<string, any>, globals: Record<string, any>) => any)
    | ReturnType<typeof previewTemplate>;
    /**
     * Description of the corresponding template code
     */
    description?: string;
    /**
     * Custom args or knobs that can be used in the preview template.
     * @deprecated
     */
    knobs?: Record<string, any>;
    /**
     * Custom args or knobs that can be used in the preview template.
     */
    args?: Record<string, any>;
    /**
     * Whether to display the copy button
     */
    copy?: boolean;
    /**
     * Language to highlight its code ("html", "css", "jsx", "tsx", "ts", "js")
     */
    language?: string;
    /**
     * Language presets to link to codesandbox
     * @see {@link https://github.com/naver/storybook-addon-preview/blob/master/README.md}
     */
    codesandbox?: CodeSandboxValue
    | ((previewMap: Record<string, string[]>) => CodeSandboxValue);
    /**
     * Whether to share line numbers when tab names are the same
     */
    continue?: boolean;
    /**
     * Formatting type for that code if you want formatting
     * Only "html" is supported as built-in support.
     * If you want to use custom formatter, use `previewFormatter` config in manager.js
     * @see {@link https://github.com/naver/storybook-addon-preview/blob/master/README.md}
     */
    format?: string | boolean;
}


export interface ParsedPreviewParameter extends PreviewParameter {
    text: string;
}
