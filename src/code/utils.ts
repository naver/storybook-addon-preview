import { CODE_TYPE } from "./consts";


export function removeThis(func: string) {
    return func.replace(/this\./g, "");
}
export function toArrow(func: string) {
    return removeThis(func.replace(/function ([^(]+)([^)]+\))/g, "$2 =>"));
}
export function toClassArrow(func: string) {
    return func.replace(/function ([^(]+)([^)]+\))/g, "$2 =>");
}
export function toArrowMethod(func: string) {
    return func.replace(/function ([^(]+)([^)]+\))/g, "$1 = $2 =>");
}
export function toMethod(func: string) {
    return func.replace(/function /g, "");
}
export function toSvelte(func: string) {
    return removeThis(func.replace(/\(([^)]*)\) (=>\s)?\{/g, (_, a1, a2) => {
        if (a1) {
            return `({ detail: ${a1} }) ${a2}{`;
        } else {
            return `() ${a2}{`;
        }
    }));
}

export function includeComment(func: string, comment: string, external: string = "") {
    return func.replace(new RegExp(`\\\/\\\/${comment}(?:-([^\\\s]*))*\\\s`, "g"), function (all, type) {
        if ((type && external && type.indexOf(external) > -1)) {
            return all;
        }
        return "";
    });
}
export function convertFunction(func: string, type: CODE_TYPE, comment: string) {
    switch (type) {
        case CODE_TYPE.FUNCTION:
            return removeThis(func);
        case CODE_TYPE.ARROW:
            return toArrow(func);
        case CODE_TYPE.CLASS_ARROW:
            return includeComment(toClassArrow(func), "method", comment);
        case CODE_TYPE.ARROW_METHOD:
            return includeComment(toArrowMethod(func), "method", comment);
        case CODE_TYPE.METHOD:
            return includeComment(toMethod(func), "method", comment);
        case CODE_TYPE.SVELTE_ARROW:
            return toSvelte(toArrow(func));
        case CODE_TYPE.SVELTE_FUNCTION:
            return toSvelte(func);
        default:
            return func;
    }
}
export function previewFunction(func: string) {
    return (type: CODE_TYPE, comment = "") => {
        let rv = convertFunction(func, type, comment);
        rv = includeComment(rv, "", comment);
        rv = includeComment(rv, comment);
        // remove all comments
        rv = rv.replace(new RegExp(`\\\n\\\s*\\\/\\\/[^\\n]*$`, "mg"), "");
        return rv;
    };
}
export function space(indent) {
    var texts: string[] = [];
    for (var i = 0; i < indent; ++i) {
        texts.push(" ");
    }
    return texts.join("");
}
export function codeIndent(text: string, {
    startIndent = 0,
    indent = 4,
    endIndet = indent,
}) {
    const texts = text.trim().split("\n");
    const length = texts.length;

    return texts.map((t, i) => {
        return space(i === 0 ? startIndent : (i === length - 1 ? endIndet : indent)) + t;
    }).join("\n");
}

export function convertGlobalCSS(text: string, targets: string[]) {
    return text.replace(new RegExp(`(${targets.map(target => {
        return target.replace(/\./g, "\\.");
    }).join("|")})`, "g"), ":global($1)");
}
