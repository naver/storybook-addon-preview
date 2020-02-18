/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
export const LIT_PRESET =  {
    dependencies: {
        "lit-element": "latest",
        "lit-html": "latest",
        "@webcomponents/webcomponentsjs": "latest",
    },
    files: {
        "index.html": `
<html>
<head>
    <title>Parcel Sandbox</title>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="src/index.css">
</head>

<body>
    <div id="app"></div>
    <script src="src/index.ts"></script>
</body>
</html>`,
    },
};
