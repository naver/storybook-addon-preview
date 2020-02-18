/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import { CODE_TYPE } from "./consts";

function replaceOnce(func: string, regx: RegExp, callback: (...args: any[]) => string) {
    let isFirst = true;
    return func.replace(regx, (all: string, ...args: any[]) => {
        if (!isFirst) {
            return all;
        }
        isFirst = false;
        return callback(all, ...args);
    })
}

export function removeThis(func: string) {
    return func.replace(/this\./g, "");
}
export function toArrow(func: string) {
    return removeThis(toClassArrow(func));
}
export function toClassArrow(func: string) {
    return replaceOnce(func, /function ([^(]+)([^)]+\))/g, (_, a1, a2) => `${a2} =>`);
}
export function toArrowMethod(func: string) {
    return replaceOnce(func, /function ([^(]+)([^)]+\))/g, (_, a1, a2) => `${a1} = ${a2} =>`);
}
export function toMethod(func: string) {
    return func.replace("function ", "");
}
export function toCustomEvent(func: string) {
    return removeThis(replaceOnce(func, /\(([^)]*)\) (=>\s)?\{/g, (_, a1, a2) => {
        if (a1) {
            return `({ detail: ${a1} }) ${a2 || ""}{`;
        } else {
            return `() ${a2 || ""}{`;
        }
    }));
}
export function removeBracket(func: string) {
    return replaceOnce(func, /(\([^)]+\))\s?=>\s?\{/g, (all, a1) => {
        return /\{|\}|\,/g.exec(a1) ? all : `${a1.replace(/\(|\)/g, "")} => {`;
    });
}

export function includeComment(func: string, comment: string, external: string = "") {
    return func.replace(new RegExp(`\\\/\\\/${comment}(?:-([^\\\s]*))*\\\s`, "g"), (all, type) => {
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
            return removeBracket(toArrow(func));
        case CODE_TYPE.CLASS_ARROW:
            return includeComment(removeBracket(toClassArrow(func)), "method", comment);
        case CODE_TYPE.ARROW_METHOD:
            return includeComment(removeBracket(toArrowMethod(func)), "method", comment);
        case CODE_TYPE.METHOD:
            return includeComment(toMethod(func), "method", comment);
        case CODE_TYPE.CUSTOM_EVENT_ARROW:
            return removeBracket(toCustomEvent(toArrow(func)));
        case CODE_TYPE.CUSTOM_EVENT_FUNCTION:
            return toCustomEvent(func);
        case CODE_TYPE.CUSTOM_EVENT_CLASS_ARROW:
            return includeComment(removeBracket(toCustomEvent(toClassArrow(func))), "method", comment);
        case CODE_TYPE.CUSTOM_EVENT_ARROW_METHOD:
            return includeComment(removeBracket(toCustomEvent(toArrowMethod(func))), "method", comment);
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
    const texts: string[] = [];
    for (let i = 0; i < indent; ++i) {
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
