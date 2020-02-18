/**
 * Copyright (c) 2020-present NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
export const ANGULAR_PRESET =  {
    dependencies: {
        "@angular/common": "^8.0.0",
        "@angular/animations": "^8.0.0",
        "@angular/compiler": "^8.0.0",
        "@angular/core": "^8.0.0",
        "@angular/forms": "^8.0.0",
        "@angular/http": "^5.2.0",
        "@angular/platform-browser": "^8.0.0",
        "@angular/platform-browser-dynamic": "^8.0.0",
        "@angular/router": "^8.0.0",
        "core-js": "^2.6.0",
        "rxjs": "^6.5.0",
        "zone.js": "^0.8.0",
    },
    files: {
        "src/main.ts": `import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

if (environment.production) {
enableProdMode();
}

platformBrowserDynamic()
.bootstrapModule(AppModule)
.catch(err => console.log(err));`,
        "src/polyfills.ts": `
import "core-js/es7/reflect";
import "zone.js/dist/zone"; // Included with Angular CLI.
`,
        "src/index.html": `
<!doctype html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<title>Angular</title>
	<base href="/">

	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="icon" type="image/x-icon" href="favicon.ico">
</head>

<body>
	<app-root></app-root>
</body>

</html>
`,
        "src/styles.css": "",
        "src/environments/environment.ts": `
export const environment = {
    production: false
};
`,
        "src/environments/environment.prod.ts": `
export const environment = {
    production: true
};
`,
        "angular-cli.json": `
{
    "apps": [
        {
            "root": "src",
            "outDir": "dist",
            "assets": ["assets", "favicon.ico"],
            "index": "index.html",
            "main": "main.ts",
            "polyfills": "polyfills.ts",
            "prefix": "app",
            "styles": ["styles.css"],
            "scripts": [],
            "environmentSource": "environments/environment.ts",
            "environments": {
                "dev": "environments/environment.ts",
                "prod": "environments/environment.prod.ts"
            }
        }
    ]
}`,
    },
}
