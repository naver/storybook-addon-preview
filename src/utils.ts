/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
export function joinStrs(strs: string[]) {
    return `[${strs.map(str => `"${str}"`).join(", ")}]`;
}
