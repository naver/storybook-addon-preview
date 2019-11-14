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
    const [preview, setPreview] = React.useState();
    const options = useParameter("preview", {});
    const codeRef = React.useRef<HTMLElement>();
    const { language, text } = getInfo(options, preview);


    useChannel({
        "preview": e => {
            setPreview(e);
        },
    });

    React.useEffect(() => {
        const el = codeRef.current;
        const code = text.trim().replace(/</g, "&lt;");

        el.innerHTML = code;
        Prism.highlightElement(el);
    });

    return <pre className={`language-${language} line-numbers`}><code ref={codeRef} className={`language-${language} line-numbers`}></code></pre>;
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


