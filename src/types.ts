/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
export type CodeSandboxTemplate = (previews: object) => object;

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
