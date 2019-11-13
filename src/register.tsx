import * as React from "react";
// import { STORY_CHANGED } from '@storybook/core-events';
import { addons, types } from "@storybook/addons";
import { useChannel } from "@storybook/api";
import { AddonPanel } from "@storybook/components";
import * as Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

function getInfo(options, preview) {
    const {
        template,
        language = "none",
    } = options;
    let text = "Update Me";

    if (options && options.template && preview) {
        text = template(preview);
    }

    return {
        text,
        language,
    };
}
const PreviewPanel = () => {
    const [options, setOptions] = React.useState({});
    const [preview, setPreview] = React.useState();
    const codeRef = React.useRef<HTMLElement>();
    const { language, text } = getInfo(options, preview);


    useChannel({
        "template": e => {
            setOptions(e);
        },
        "preview": e => {
            setPreview(e);
        }
    });

    React.useEffect(() => {
        const el = codeRef.current;
        if (!el) {
            return;
        }
        el.innerText = text.trim();
        Prism.highlightElement(el);
    });

    return <pre className={`language-${language} line-numbers`}><code ref={codeRef} className={`language-${language} line-numbers`}></code></pre>;
};


addons.register("daybrush/storyboook-addon-preview", api => {
    addons.add("daybrush/storyboook-addon-preview/panel", {
        title: "Preview",
        type: types.PANEL,
        render: ({ active, key }) => (
            <AddonPanel active={active} key={key} >
                <PreviewPanel />
            </AddonPanel>
        ),
    });
});


