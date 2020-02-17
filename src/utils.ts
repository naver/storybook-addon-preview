export function joinStrs(strs: string[]) {
    return `[${strs.map(str => `"${str}"`).join(", ")}]`;
}
