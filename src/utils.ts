
/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import { OptionsType } from "./types";
import { space } from "./code/utils";

export function joinStrs(strs: string[]) {
    return `[${strs.map(str => `"${str}"`).join(", ")}]`;
}


export function optionsTemplate(
    names: string[],
    options: OptionsType = {},
) {
    const {
        prefix = "",
        suffix = "",
        indent = 4,
        endIndent = indent - 4,
        joinSeparator = "\n",
        separator = ",",
        endSeparator = separator,
        template = name => [`${name}: `, name],
    } = options;
    const strings = [];
    const values = [];
    const length = names.length;

    if (prefix) {
        strings.push(`${prefix}${joinSeparator}`);
        values.push("");
    }
    names.forEach((name, i) => {
        const result = template(name, i);
        const resultLength = result.length;

        for (let j = 0; j < resultLength; j += 2) {
            if (j === 0) {
                strings.push(`${space(indent)}${result[j]}`);
            } else {
                strings.push(result[j]);
            }
            values.push(result[j + 1]);
        }
        if (length - 1 === i) {
            strings.push(`${endSeparator}${joinSeparator}`);
        } else {
            strings.push(`${separator}${joinSeparator}`);
        }
        values.push("");
    });
    if (suffix) {
        strings.push(`${space(endIndent)}${suffix}`);
    } else {
        strings.push("");
    }
    return [strings, values];
}
