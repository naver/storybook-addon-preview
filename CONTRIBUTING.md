# How to contribute to storybook-addon-preview
storybook-addon-preview is opened to everyone and we're welcoming for any kind of contribution.
We believe that our project can grow with your interests helping others' necessities.

## Style Guide

storybook-addon-preview has several style guidelines to follow.
Before your start, please read attentively below instructions.


### How to add CodeSandbox preset

* `template` is based on [this](https://github.com/codesandbox/codesandbox-importers/blob/master/packages/import-utils/src/create-sandbox/templates.ts#L63) logic.
* `dependencies`, `devDependencies`, `scripts` are based on `package.json`'s `dependencies`, `devDependencies`, `scripts`
* `userDependencies` are dependencies of type array. ([`vue@^2.6.0`])
* `scripts`
* `files` has string, [CodeFileTab(object)](https://github.com/naver/storybook-addon-preview/blob/master/src/types.ts), and null types.
    * CodeFileTab: Returns the preview tab as a string value.
    * null: Delete the existing file.


1. You can add CodeSandbox to the `src/codesandbox` folder.
2. The name should be something like `DEFAULT_$$$$_CODESANDBOX` ex) DEFAULT_VUE_CODESANDBOX.

```js
import { CodeSandboxTemplate } from "../types";

export const DEFAULT_$$$$_CODESANDBOX: CodeSandboxTemplate = (userDependencies = [], files = {}) => {
    return {
        template: "vue-cli",
        files: {
            "src/main.js": `
import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
    render: h => h(App)
}).$mount("#app");
        `,
            "src/App.vue": {
                tab: "Vue",
            },
            ...files,
        },
        dependencies: {
            "vue": "^2.6.0",
        },
        userDependencies,
    };
};
```

### Linting and Code Conventions
We adopted [ESLint](http://eslint.org/) to maintain our code quality
All rules are described at [.eslintrc](.eslintrc) file.

### Commit Log Guidelines
storybook-addon-preview use commit logs in many different purposes (like creating CHANGELOG, ease history searching, etc.).
To not break, you'll be forced to follow our commit log guidelines.
Before your commit/push, make sure following our commit log guidelines.

The outline is as below:
```
<type>(<module>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

- **Types**
  - **feat**: A new feature
  - **fix**: A bug fix
  - **docs**: Documentation only changes
  - **style**: Changes that do not affect the meaning of the code. Such as white-space, formatting, missing semi-colons, etc... It also possible to change JSHint, JSCS rules of the code.
  - **refactor**: A code change that neither fixes a bug nor adds a feature
  - **test**: Adding missing tests. Changing tests.
  - **demo**: Adding missing demos. Changing demos.
  - **chore**: Changes to the build process or tools and libraries such as documentation generation

[See More Commit Log Guidelines](https://github.com/naver/egjs/wiki/Commit-Log-Guidelines)

## How to submit Pull Requests
Steps to submit your pull request:

1. Fork `storybook-addon-preview` on your repository
2. Create new branch from your egjs master branch (and be sure always to be up-to-date)
3. Do your work
4. Create test code for your work (when is possible)
5. Run `npm run lint` for linting and Code Conventions (update until without any error or warnings)
8. Write commit log following convention and push to your repository branch.
9. Create a new PR from your branch to storybook-addon-preview.
10. Wait for reviews.
    When your contribution is well enough to be accepted, then will be merged to our branch.
11. All done!


## License
By contributing to storybook-addon-preview, you're agreeing that your contributions will be licensed under its [MIT](https://opensource.org/licenses/MIT) license.
