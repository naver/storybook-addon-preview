## Storybook Addon Preview

Storybook Addon Preview can show user selected [knobs](https://github.com/storybookjs/storybook/tree/master/addons/knobs) in various framework code in [Storybook](https://storybook.js.org/)



스크린샷


### Getting Started
First of all, you need to install Knobs into your project as a dev dependency.


```
npm i storybook-addon-preview --dev
```


addons.js

```js
import "storybook-addon-preview/register";
```

Now, write your stories with preview.

```js
import { withPreview, previewTemplate, DEFAULT_VANILLA_CODESANDBOX } from "storybook-addon-preview";
import { withKnobs, boolean, number } from "@storybook/addon-knobs";

const stories = storiesOf("Example", module);

stories.addDecorator(withKnobs).addDecorator(withPreview);

stories.add("Example", e => {
    const opt1 = boolean("opt1", false);
    const opt2 = number("num1", 0);

    return ....;
}, {
    preview: [
        {
            tab: "Vanilla",
            template: previewTemplate`
const inst = new Instance({
    opt1: ${"opt1"},
    num1: ${"num1"},
});
            `,
            language: "ts",
            copy: true,
            codesandbox: DEFAULT_VANILLA_CODESANDBOX,
        },
    ]
});
```
### Properties

|Name|Type|Description|
|---|---|---|
|tab|string|preview can show multiple tab and can determine the name of the tab. If you have the same name, you can show multiple codes on one tab.|
|template|string, function|Code to display on the screen. If you use knobs, use previewTemplate. If the knobs are not used, they can be represented as strings.|
|continue|boolean|If the tab name is the same and the code is different, enable true if you want to continue the line number.|
|lanauge|string|Language to highlight the code in the template (js,ts,jsx,tsx,html,css)|
|codesandbox|function|Link the code you used to the code sandbox.|


### CodeSandBox
Link the code you used to the code sandbox.
There is a dependency and initial settings file for linking code sandboxes.
The frameworks we support are react, angular, svelte, lit, preact, and vue.

```js
const CODESANDBOX_FUNCTION = (previews) => ({
    // react, angular, svelte, lit, preact, vue
    framework: "FRAMEWORK_TYPE",
      files: {
        // Tab name and code order (Mostly 0)
        "src/App.tsx": previews["TAB NAME"][0], 
        "src/styles.css": previews["TAB NAME2"][0],
    },
    // External modules except framework modules used in code
    userDependencies: ["@egjs/react-infinitegrid@latest"],
});
```

#### You can use the default codesandbox presets.

|Name|Required Tab Names|Code|
|----|---|---|
|DEFAULT_VANILLAJS_CODESANDBOX(JS)|HTML, CSS, VANILLA|[View Code](https://github.com/naver/storybook-addon-preview/blob/master/src/codesandbox/VanillaJS.ts)|
|DEFAULT_VANILLA_CODESANDBOX(TS)|HTML, CSS, VANILLA|[View Code](https://github.com/naver/storybook-addon-preview/blob/master/src/codesandbox/Vanilla.ts)|
|DEFAULT_REACT_CODESANDBOX(TS)|React, CSS|[View Code](https://github.com/naver/storybook-addon-preview/blob/master/src/codesandbox/React.ts)
|DEFAULT_ANGULAR_CODESANDBOX|CSS, Angular(html, component, module)|[View Code](https://github.com/naver/storybook-addon-preview/blob/master/src/codesandbox/Angular.ts)|
|DEFAULT_VUE_CODESANDBOX|Vue|[View Code](https://github.com/naver/storybook-addon-preview/blob/master/src/codesandbox/Vue.ts)|
|DEFAULT_SVELTE_CODESANDBOX|Svelte|[View Code](https://github.com/naver/storybook-addon-preview/blob/master/src/codesandbox/Svelte.ts)|
|DEFAULT_LIT_CODESANDBOX|Lit|[View Code](https://github.com/naver/storybook-addon-preview/blob/master/src/codesandbox/Lit.ts)|