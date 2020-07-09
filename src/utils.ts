
/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
export function joinStrs(strs: string[]) {
    return `[${strs.map(str => `"${str}"`).join(", ")}]`;
}
export function getHighlightInfo(code: string) {
    const highlightLines: number[][] = [];
    const codes = code.split("\n");
    const nextCodes = codes.map((line, i) => {
        let nextLine = line
            .replace(/\/\*\s*\[highlight\]/g, `/*`)
            .replace(/&lt;!--\s*\[highlight\]/g, "&lt;!--")
            .replace(/^(\s*)\/\/\s*\[highlight\]/g, "$1//");

        if (nextLine !== line) {
            highlightLines.push([i + 1, i + 2]);
            return nextLine;
        }
        nextLine = line.replace(/\/\/\s*\[highlight\]/g, "//");

        if (nextLine !== line) {
            highlightLines.push([i + 1]);
            return nextLine;
        }
        nextLine = line
            .replace(/\/\*\s*\[highlight-start\]/g, `/*`)
            .replace(/&lt;!--\s*\[highlight-start\]/g, "&lt;!--")
            .replace(/^(\s*)\/\/\s*\[highlight-start\]/g, "$1//");

        if (nextLine !== line) {
            const forwardCodes = codes.slice(i + 1);
            const length = forwardCodes.length;

            for (let j = 0; j < length; ++j) {
                const nextForwardCode = forwardCodes[j]
                    .replace(/\/\*\s*\[highlight-end\]/g, `/*`)
                    .replace(/&lt;!--\s*\[highlight-end\]/g, "&lt;!--")
                    .replace(/^(\s*)\/\/\s*\[highlight-end\]/g, "$1//");

                if (nextForwardCode !== forwardCodes[j]) {
                    codes.splice(i + 1 + j, 1);
                    highlightLines.push([i + 1, i + 1 + j]);
                    return nextLine;
                }
            }
        }
        return nextLine;
    });
    nextCodes.length = codes.length;

    return {
        lines: highlightLines.map(line => line.join("-")),
        code: nextCodes.join("\n"),
    }
}
