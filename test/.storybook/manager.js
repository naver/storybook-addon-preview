import { addons } from "@storybook/addons";
import * as prettier from "prettier/standalone";
import * as htmlParser from "prettier/parser-html";
import * as babelParser from "prettier/parser-babel";
import * as postCSSParser from "prettier/parser-postcss";


addons.setConfig({
    panelPostion: "right",
    previewFormatter: (format, code) => {
        if (format === "tsx") {
            return prettier.format(code, {
                parser: "babel-ts",
                plugins: [
                    htmlParser,
                    babelParser,
                    postCSSParser,
                ],
            });
        } else if (format === "vue") {
            return prettier.format(code, {
                parser: "vue",
                plugins: [
                    htmlParser,
                    babelParser,
                    postCSSParser,
                ],
            });
        }
        return code;
    },
});
