import { optionsTemplate } from "../utils";

export function DEFAULT_PROPS_TEMPLATE(names: string[], indent: number = 4) {
    return optionsTemplate(names,
        {
            indent,
            separator: ",\n",
            joinSeparator: "",
            endSeparator: ",",
        },
    );
}
export function JSX_PROPS_TEMPLATE(names: string[], indent: number = 4) {
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
export function ANGULAR_PROPS_TEMPLATE(names: string[], indent: number = 4) {
    return optionsTemplate(names,
        {
            indent,
            template: name => [`[${name}]="`, name, "\"", ""],
            separator: "\n",
            joinSeparator: "",
            endSeparator: "",
        },
    );
}
export function VUE_PROPS_TEMPLATE(names: string[], indent: number = 4, prefix = "v-bind") {
    return optionsTemplate(names,
        {
            indent,
            template: name => [`${prefix}:${name}="`, name, "\"", ""],
            separator: "\n",
            joinSeparator: "",
            endSeparator: "",
        },
    );
}
export function LIT_PROPS_TEMPLATE(names: string[], indent: number = 4) {
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
