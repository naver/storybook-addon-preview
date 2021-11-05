/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
export interface CodeSandboxValue {
    template?: string;
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
