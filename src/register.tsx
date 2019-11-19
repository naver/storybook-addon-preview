import * as React from "react";
import { addons, types } from "@storybook/addons";
import { useChannel, useParameter } from "@storybook/api";
import { AddonPanel } from "@storybook/components";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import * as Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/themes/prism.css";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "./preview.css";

import CodeSandBox from "./CodeSandBox";

export const DEFAULT_CODE = `
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
function getInfo(options, preview) {
    const {
        template,
        description = "",
        tab = "Code",
        language = "javascript",
    } = options;
    let text = DEFAULT_CODE;

    if (typeof template === "string") {
        text = template;
    } else if (typeof template === "function" && hasKnobs(preview)) {
        text = template(preview);
    }

    return {
        ...options,
        description,
        text: text.trim(),
        tab,
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
    const [defaultTabIndex, setTabIndex] = React.useState(0);
    const [
        preview = knobs,
        setPreview,
    ] = React.useState();

    const options = useParameter("preview", {
        template: "",
    });
    const panelRef = React.useRef<HTMLDivElement>();
    const optionsList = [].concat(options);
    const userKnobs = {...preview};

    optionsList.forEach(o => {
        const optionKnobs = o.knobs;
        if (optionKnobs) {
            for (const name in optionKnobs) {
                userKnobs[name] = optionKnobs[name];
            }
        }
    });
    const templates = optionsList.filter(o => "template" in o).map(o => getInfo(o, userKnobs));
    const previews = [];
    const templatesObject = {};
    
    templates.forEach(template => {
        const { tab, codesandbox } = template;
        if (!templatesObject[tab]) {
            templatesObject[tab] = [];
            previews.push({
                codesandbox,
                tab,
                templates: templatesObject[tab],
            });
        }
        templatesObject[tab].push(template);
    });

    const previewsObject = {};
    for (const name in templatesObject) {
        previewsObject[name] = templatesObject[name].map(template => template.text);
    }
    const tabIndex = Math.min(defaultTabIndex, previews.length);


    useChannel({
        "preview": e => {
            setPreview(e);
        },
        "knobs": e => {
            setKnobs(e);
            setPreview(undefined);
        },
    });

    React.useEffect(() => {
        const panelElement = panelRef.current;
        const codeElements = [].slice.call(panelElement.querySelectorAll("pre code"));
        const p = previews[tabIndex];
        if (!p) {
            codeElements.forEach(codeElement => {
                codeElement.innerHTML = "";
            });
            return;
        }
        let startNumber = 1;
        codeElements.forEach((codeElement, i) => {
            const template = p.templates[i];
            const text = template.text || "";
            const code = text.replace(/</g, "&lt;");

            if (!template.continue) {
                startNumber = 1;
            }
            codeElement.parentElement.setAttribute("data-start", startNumber);
            codeElement.innerHTML = code;

            Prism.highlightElement(codeElement);
            startNumber += code.split("\n").length;
        });
    });
    return (
        <Tabs className={["react-tabs", "preview-tabs"]}onSelect={index => {
            setTabIndex(index);
        }}>
            <TabList>
                {previews.map(({ tab }) => <Tab key={tab}>{tab}</Tab>)}
            </TabList>

            {previews.map(({ codesandbox, tab, templates: previewTemplates }) => {
                return (<TabPanel key={tab}>                    
                    <div className="panel" ref={panelRef}>
                        {codesandbox && <CodeSandBox info={typeof codesandbox === "function" ? codesandbox(previewsObject) : codesandbox} />}
                        {previewTemplates.map(({ language, description, }, i) => {
                            return <div className="code-preview" key={i}>
                                {description && <div className="code-description">{description}</div>}
                                <pre className={`language-${language} line-numbers`} style={{
                                    backgroundColor: "transparent",
                                }}><code className={`language-${language} line-numbers`}></code></pre>
                            </div>
                        })}
                    </div>
                </TabPanel>);
            })}
        </Tabs>
    );
};


addons.register("daybrush/storyboook-addon-preview", api => {
    addons.add("daybrush/storyboook-addon-preview/panel", {
        title: "Code Preview",
        type: types.PANEL,
        paramKey: "preview",
        render: ({ active, key }) => (
            <AddonPanel active={active} key={key} >
                <PreviewPanel />
            </AddonPanel>
        ),
    });
});


