import { joinStrs } from "../utils";
import { CodeSandboxTemplate } from "../types";

export const DEFAULT_VUE_CODESANDBOX = (dependencies: string[]) => new Function(`
var previews = arguments[0];
return {
    framework: "vue",
    files: {
        "src/App.vue":  previews["Vue"].join("\\n"),
    },
    userDependencies: ${joinStrs(dependencies)},
};`) as CodeSandboxTemplate;