# hacktranslate

Translation app to translate (for now) an entire page of document using outsourced LLM.

Developed with:
- Hugo
- Lit
- Sass
- Storybook
- IBM's Carbon Design System

## Development Rant

Despite Hugo being super fast, the API is too limited in what i'm trying to do with it, especially in it's javascript builder which exposed too little options.

There are some features I introduced in this project which is what Hugo cannot provide by design:
- JS-based components
- Modules treeshaking
- SCSS/SASS loader in esbuild
- Lit SCSS via esbuild
- Lit components SSR rendering into hugo partial
- Deep js dependency source code change can trigger hugo live reload
- Storybook

Basically, what I'm doing is implementing js building workflow independently from hugo, which can be seen in [`./scripts/build.js`](./scripts/build.js).

By implementing it this way, I can use the components in both js and hugo environment. For example, [`./scripts/ssr_components/header.ts`](./scripts/ssr_components/header.ts) can be used in storybook by importing it directly (`import Header from "SSRComponents/header"`) and in hugo via partial call (`{{ partial "artifact/components/header" }}`)

This will yield development workflows:

### Hugo development workflow
1. Start `yarn dev:esbuild` & `hugo server`
2. Develop in `./app`
3. Watch the artifact of `./app` emitted `./artifact` on source code change
4. Since `./artifact` are mounted to `./assets` and `./layouts/partials`, each source code change will trigger live reload in hugo, no matter how deep you change the source code since esbuild will watch the dependency tree instead of hugo fs!

### Storybook development workflow
1. Start `yarn storybook`
2. Develop in `./app`
3. Storybook (vite) will hot reload automatically since we are working with js directly
