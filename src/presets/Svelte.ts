export default {
    dependencies: {
        "svelte": "^3.12.0",
    },
    files: {
        "index.js": `
import App from "./App.svelte";

const app = new App({
    target: document.body
});

export default app;
        `,
    }
}