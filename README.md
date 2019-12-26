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
import { withPreview, previewTemplate } from "storybook-addon-preview";
import { withKnobs, boolean, number } from "@storybook/addon-preview";

const stories = storiesOf("Example", module);

stories.addDecorator(withKnobs).addDecorator(withPreview);

stories.add("Example", e => {
    const opt1 = boolean("opt1", false);
    const opt2 = number("num1", 0);

    return ....;
}, {
    preview: [
        {
            tab: "tabName",
            template: previewTemplate`
const inst = new Instance({
    opt1: ${"opt1"},
    num1: ${"num1"},
});
            `,
            language: "ts",
        },
    ]
});
```
### Properties

|name|type|description|
|---|---|---|
|tab|string|preview can show multiple tab and can determine the name of the tab. If you have the same name, you can show multiple codes on one tab.|
|template|string, function|Code to display on the screen. If you use knobs, use previewTemplate. If the knobs are not used, they can be represented as strings.|
|continue|boolean|If the tab name is the same and the code is different, enable true if you want to continue the line number.|
|lanauge|string|Language to highlight the code in the template (js,ts,jsx,tsx,html,css)|
|codesandbox|function||


### CodeSandBox
|name|required tabs|
|----|---|
|DEFAULT_VANILLA_CODESANDBOX|HTML, CSS, VANILLA|
|DEFAULT_REACT_CODESANDBOX|React, CSS|
|DEFAULT_ANGULAR_CODESANDBOX|CSS, Angular(html, component, module)|
|DEFAULT_VUE_CODESANDBOX|Vue|
|DEFAULT_SVELTE_CODESANDBOX|Svelte|