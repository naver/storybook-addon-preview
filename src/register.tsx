import * as React from "react";
// import { STORY_CHANGED } from '@storybook/core-events';
import { addons, types } from "@storybook/addons";
import { useChannel, useParameter } from "@storybook/api";
import { AddonPanel } from "@storybook/components";
import * as Prism from "prismjs";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/themes/prism.css";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

function getInfo(options, preview) {
    const {
        template,
        language = "javascript",
    } = options;
    let text = `
// Update Preview Setting
import { storiesOf } from '@storybook/react';
import { withPreview } from "storybook-addon-preview";
import { withKnobs, boolean } from '@storybook/addon-knobs';

const stories = storiesOf('Storybook Preview', module);
stories.addDecorator(withKnobs);
stories.addDecorator(withPreview);

stories.add('story name', () => {
    const param1 = boolean("param1", false);
    const param2 = boolean("param2", false);

    return (<div>
        param1: {param1}<br/>
        param2: {param2}<br/>
        </div>);
}, {
    preview: {
    template: ({ param1, param2}) => ${"`"}
const App = () => (<div>
param1: ${"$"}{param1}<br/>
param2: ${"$"}{param2}<br/>
</div>);${"`"},
    language: "jsx",
});
    `;

    if (typeof template === "string") {
        text = template;
    } else if (typeof template === "function" && hasKnobs(preview)) {
        text = template(preview);
    }

    return {
        text,
        language,
    };
}

function hasKnobs(knobs) {
    const type = typeof knobs;

    if (type === "undefined") {
        return false;
    }
    if (type !== "object") {
        return true;
    }
    if (Array.isArray(knobs)) {
        return true;
    }
    for (const name in knobs) {
        return true;
    }
    return false;
}

const PreviewPanel = () => {
    const [knobs, setKnobs] = React.useState({});
    const [
        preview = knobs,
        setPreview,
    ] = React.useState();
    const options = useParameter("preview", {});
    const codeRef = React.useRef<HTMLElement>();
    const { language, text } = getInfo(options, preview);

    useChannel({
        "preview": e => {
            setPreview(e);
        },
        "knobs": e => {
            setPreview(undefined);
            setKnobs(e);
        },
    });

    React.useEffect(() => {
        const el = codeRef.current;
        const code = text.trim().replace(/</g, "&lt;");

        el.innerHTML = code;
        Prism.highlightElement(el);
    });

    return <pre className={`language-${language} line-numbers`} style={{
        backgroundColor: "transparent",
    }}><code ref={codeRef} className={`language-${language} line-numbers`}></code></pre>;
};


addons.register("daybrush/storyboook-addon-preview", api => {
    addons.add("daybrush/storyboook-addon-preview/panel", {
        title: "Preview",
        type: types.PANEL,
        paramKey: "preview",
        render: ({ active, key }) => (
            <AddonPanel active={active} key={key} >
                <PreviewPanel />
            </AddonPanel>
        ),
    });
});


