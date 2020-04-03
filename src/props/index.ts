import { PropsOptions, OptionsType, ObjectType } from "../types";
import { space } from "../code/utils";

export function PROPS_TEMPLATE(
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

export function OBJECT_TEMPLATE(props: any[], options: ObjectType = {}) {
    return PROPS_TEMPLATE(
        props,
        {
            prefix: "{",
            suffix: "}",
            ...options,
        },
    );
}
export function DEFAULT_PROPS_TEMPLATE(names: string[], {
    indent = 4,
}: PropsOptions = {}) {
    return PROPS_TEMPLATE(names,
        {
            indent,
            separator: ",\n",
            joinSeparator: "",
            endSeparator: ",",
        },
    );
}
export function JSX_PROPS_TEMPLATE(names: string[], {
    indent = 4,
}: PropsOptions = {}) {
    return PROPS_TEMPLATE(names,
        {
            indent,
            template: name => [`${name}={`, name, "}", ""],
            separator: "\n",
            joinSeparator: "",
            endSeparator: "",
        },
    );
}
export function ANGULAR_PROPS_TEMPLATE(names: string[], {
    indent = 4,
    wrap = '"',
}: PropsOptions = {}) {
    return PROPS_TEMPLATE(names,
        {
            indent,
            template: name => [`[${name}]=${wrap}`, name, wrap, ""],
            separator: "\n",
            joinSeparator: "",
            endSeparator: "",
        },
    );
}
export function VUE_PROPS_TEMPLATE(names: string[], {
    indent = 4,
    prefix = "v-bind",
    wrap = '"',
}: PropsOptions = {}) {
    return PROPS_TEMPLATE(names,
        {
            indent,
            template: name => [`${prefix}:${name}=${wrap}`, name, wrap, ""],
            separator: "\n",
            joinSeparator: "",
            endSeparator: "",
        },
    );
}
export function LIT_PROPS_TEMPLATE(names: string[], {
    indent = 4,
}: PropsOptions = {}) {
    return PROPS_TEMPLATE(names,
        {
            indent,
            template: name => [`.${name}=${"$"}{`, name, "}", ""],
            separator: "\n",
            joinSeparator: "",
            endSeparator: "",
        },
    );
}
