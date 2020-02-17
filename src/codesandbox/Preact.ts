import { joinStrs } from "../utils";
import { CodeSandboxTemplate } from "../types";

export const DEFAULT_REACT_CODESANDBOX = (dependencies: string[]) => new Function(`
var previews = arguments[0];
return {
    framework: "preact",
    files: {
        "src/App.tsx": previews["Preact"][0],
        "src/App.css": previews["CSS"][0],
    },
    userDependencies: ${joinStrs(dependencies)},
};`) as CodeSandboxTemplate;