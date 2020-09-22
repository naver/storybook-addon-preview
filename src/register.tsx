/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import * as React from "react";
import { addons, types } from "@storybook/addons";
import { AddonPanel } from "@storybook/components";
import PreviewPanel from "./PreviewPanel";

addons.register("naver/storyboook-addon-preview", api => {
    addons.add("naver/storyboook-addon-preview/panel", {
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


