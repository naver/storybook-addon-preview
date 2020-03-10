import { optionsTemplate } from "../utils";
import { PropsOptions } from "../types";

export function DEFAULT_PROPS_TEMPLATE(names: string[], {
    indent = 4,
}: PropsOptions = {}) {
    return optionsTemplate(names,
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
    return optionsTemplate(names,
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
    return optionsTemplate(names,
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
    return optionsTemplate(names,
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
    return optionsTemplate(names,
        {
            indent,
            template: name => [`.${name}=${"$"}{`, name, "}", ""],
            separator: "\n",
            joinSeparator: "",
            endSeparator: "",
        },
    );
}
