import * as React from "react";
import { useArgs, useParameter, useChannel } from "@storybook/api";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import * as Prism from "prismjs";

import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";

import "react-tabs/style/react-tabs.css";
import "prismjs/themes/prism.css";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/line-highlight/prism-line-highlight";
import "prismjs/plugins/line-highlight/prism-line-highlight.css";
import "./css/preview.css";
import "./css/prism-dark.css";

import CodeSandBox from "./CodeSandBox";
import CopyButton from "./CopyButton";
import { getHighlightInfo } from "./utils";

function processArrayTemplate(
  [strings, values]: any[],
  props: { [key: string]: any }
) {
  return strings.reduce((prev, next, i) => {
    let name = values[i];

    if (typeof name === "undefined") {
      name = "";
    }
    let value: any = name;

    if (name) {
      if (typeof name === "function") {
        try {
          value = name(props);
        } catch (e) {}
      }
      if (Array.isArray(name)) {
        value = processArrayTemplate(name, props);
      } else if (name in props) {
        value = JSON.stringify(props[name]);
      }
    }
    return prev + next + value;
  }, "");
}
function getInfo(options, preview) {
  const {
    template,
    description = "",
    tab = "Code",
    language = "javascript",
  } = options;
  let text = "";

  if (typeof template === "string") {
    text = template;
  } else if (typeof template === "function") {
    try {
      text = template(preview);
    } catch (e) {
      text = "";
    }
  } else if (Array.isArray(template)) {
    text = processArrayTemplate(template, preview);
  }

  return {
    ...options,
    description,
    text: (text || "")
      .replace(/[\n\r]/g, "")
      .replace(/^\s+|\s+$/g, "")
      .replace(/\s+/g, " ")
      .split("dls-new-line")
      .join("\n"),
    tab,
    language,
  };
}

const PreviewPanel = () => {
  const [args, updateArgs] = useArgs();
  const [userKnobs, setKnobs] = React.useState({});
  const [preview, setPreview] = React.useState<object>();
  const [tabIndexInfo, setTabIndexInfo] = React.useState({
    index: 0,
  });
  const options = [].concat(useParameter("preview", []));
  const panelRef = React.useRef<HTMLDivElement>();
  const props = { ...(args || userKnobs), ...preview };

  useChannel({
    preview: (e) => {
      setPreview(e);
    },
    args: (e) => {
      updateArgs(e);
      setPreview(undefined);
    },
    knobs: (e) => {
      setKnobs(e);
      setPreview(undefined);
    },
  });
  options.forEach((o) => {
    const option = o.args || o.knobs;
    for (const name in option) {
      props[name] = option[name];
    }
  });
  const templates = options
    .filter((option) => "template" in option)
    .map((option) => getInfo(option, props || {}));

  const previews = [];
  const templateMap = {};

  templates.forEach((template) => {
    const { tab, codesandbox } = template;
    if (!templateMap[tab]) {
      templateMap[tab] = [];
      previews.push({
        codesandbox,
        tab,
        templates: templateMap[tab],
      });
    }
    templateMap[tab].push(template);
  });

  const previewMap = {};

  for (const name in templateMap) {
    previewMap[name] = templateMap[name].map((template) => template.text);
  }
  // Since there may be a missing tab, the index of the tab is forcibly changed.
  tabIndexInfo.index = Math.max(
    0,
    Math.min(tabIndexInfo.index, previews.length - 1)
  );
  const onCopyText = (tab: number, index: number) => {
    const copyPreview = previews[tab];

    if (!copyPreview) {
      return "";
    }
    const texts: string[] = [];

    copyPreview.templates.slice(index).every((template, i) => {
      if (i > 0 && !template.continue) {
        return false;
      }
      const text = template.text;

      if (text) {
        texts.push(text);
      }
      return true;
    });

    return texts.join("\n");
  };
  React.useEffect(() => {
    const panelElement = panelRef.current;

    if (!panelElement) {
      return;
    }
    const codeElements = [].slice.call(
      panelElement.querySelectorAll("pre code")
    );
    const p = previews[tabIndexInfo.index];
    if (!p) {
      codeElements.forEach((codeElement) => {
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
      const { lines: highlightLines, code: nextCode } = getHighlightInfo(code);

      const preElement = codeElement.parentElement;
      preElement.setAttribute("data-start", startNumber);
      preElement.setAttribute("data-line", highlightLines.join(","));
      codeElement.innerHTML = nextCode;

      Prism.highlightElement(codeElement);
      startNumber += code.split("\n").length;
    });
  });
  if (!previews.length) {
    return (
      <div className="no-preview">
        <h4 className="no-preview-title">No Preview found</h4>
        <p className="no-preview-description">
          <a
            href="https://github.com/naver/storybook-addon-preview"
            target="_blank"
          >
            Learn how to dynamically create source code previews with controls
            or knobs
          </a>
        </p>
      </div>
    );
  }
  return (
    <Tabs
      className={["react-tabs", "preview-tabs"]}
      onSelect={(index) => {
        setTabIndexInfo({
          index,
        });
      }}
      defaultIndex={tabIndexInfo.index}
    >
      <TabList>
        {previews.map(({ tab }) => (
          <Tab key={tab}>{tab}</Tab>
        ))}
      </TabList>

      {previews.map(({ codesandbox, tab, templates: previewTemplates }, i) => {
        return (
          <TabPanel key={tab}>
            <div className="panel" ref={panelRef}>
              {codesandbox && (
                <CodeSandBox
                  info={
                    typeof codesandbox === "function"
                      ? codesandbox(previewMap)
                      : codesandbox
                  }
                />
              )}
              {previewTemplates.map(({ language, description, copy }, j) => {
                return (
                  <div className="code-preview" key={j}>
                    {copy && (
                      <CopyButton tab={i} index={j} onCopyText={onCopyText} />
                    )}
                    {description && (
                      <div className="code-description">{description}</div>
                    )}
                    <pre
                      className={`language-${language} line-numbers`}
                      style={{
                        backgroundColor: "transparent",
                      }}
                    >
                      <code
                        className={`language-${language} line-numbers`}
                      ></code>
                    </pre>
                  </div>
                );
              })}
            </div>
          </TabPanel>
        );
      })}
    </Tabs>
  );
};

export default PreviewPanel;
