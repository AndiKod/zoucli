# Zou! CLI

Scaffold a custom Zou! SSG Boilerplate or and more with interactive prompt.

*— Zou! is a french interjection that stands for: JustDoIt! GoAhead!*

Simple SSG setup, with close to zero configuration or dependencies but flexible enough to craft web projects or fire a quick sandbox and try things from a curated list of CDN's, Macros & Mixins.


| -Folder- | -Purpose-    |
| --- | --- |
| **Data:** | Add data in .js / load in zou.config.js / use in .njk templates |
| **Layouts:** | General .njk templates, composed with partials and more |
| **Macros:** | Styled components, functionalities, (many possibilities) |
| **Pages:** | Extending a layout. The main element with dynamic content |
| **Partials:** | Sub-pages to be included in others |
| **Scripts:** | Assets to be copied to public, generally images |
| **Styles:** | SCSS / Tailwind. Whatever flavor you like |

Everything is "watched and live served" then on `npm run build` the production html/css/js will be in the `public` folder, ready to go on Vercel or Netlify optimized. No JS framework, no mega-bundler, almost nothing new to learn yet it does the job "out of the box". #HaveFun

Related Docs: [Nunjucks](https://mozilla.github.io/nunjucks/templating.html), [Openprops](https://open-props.style/#getting-started), [Hyperscript](https://hyperscript.org/docs/#basics), [SCSS](https://sass-lang.com/documentation/variables/), [zouMixins](https://github.com/AndiKod/zouMixins), [Tailwind](https://tailwindcss.com/docs/installation), [Typescript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html). 

Via [zouMacros](https://github.com/AndiKod/zouMacros): [AlpineJS](https://alpinejs.dev/start-here), [htmX](https://htmx.org/), [Pocketbase](https://pocketbase.io/docs/), [ChotaCSS](https://jenil.github.io/chota/#docs), [BonsaiCSS](https://www.bonsaicss.com/), [Bulma](https://bulma.io/documentation/), [Bootstrap](https://getbootstrap.com/docs/5.3/getting-started/introduction/) Comming soon: [Supabase](https://supabase.com/docs/guides/database/overview), [Planetscale](https://planetscale.com/docs).

## Scaffold a new Zou! project

From a terminal, just call:

```
npx zou create myWebsite
```

The prompt will ask:

<details>
  <summary>Author:</summary>
  <p>Defaulting to the great *DevMysterio*, here you obviously answer with your author name, for the package.json field.</p>
</details>

<details>
  <summary>What CSS flavor?</summary>
  <p>A select prompt will make you chose between SCSS and Tailwind setups. On top of the SCSS one, OpenProps is also integrated, and managing the Dark/Light theming.</p>
</details>

<details>
  <summary>What Scripting?</summary>
  <p>The choice here is between Javascript or Typescript. The Javascript is processed by ESBuild and optimised for production when ready. Hyperscript provides the interactivity (and some fun). On the side of Typescript, it's simply a main.ts as souce, tsconfig file and TSC compile NPM scripts.</p>
</details>

<details>
  <summary>Play with some CDN</summary>
  <p>Pick (By pressing the Spacebar!)one or more CDNs like ChotaCSS, Bootstrap, AlpineJS, PocketBase, htmX (I know), from zouMacros package. You can also add/remove them easily afterwards by adding/removing things like `{{ cdn.pkg('bulma')}}` in the head section of a layout.</p>
</details>

<details>
  <summary>Open in VSCode?</summary>
  <p>You can answer 'Nope' at that prompt and procede with NeoVim or hardcore Vi, but if you're using VSCode, Zou! will try to "code ." and open your project folder while installing the packages.</p>
</details>

<details>
  <summary>Install packages Now?</summary>
  <p>This Y/n prompt—if Y—will make Zou! move into `myWebsite` where all the files & folders were generated, open the folder in VSCode, launch an `npm install` then fire the dev server with `npm run dev` automatically when ready. Sit back & enjoy.</p>
</details>

## Scaffold a new Page

From a terminal, just call:

```
npx zou make:file
```

The prompt will ask:

<details>
  <summary>What type?</summary>
  <p>For the moment it will make you chose between Layout, Page or Partial. The goal is to have a quite complete scafold targets along the way.</p>
</details>

<details>
  <summary>Page</summary>
  <p>Zou! will ask for the title, the slug and the layout. Say you answer: About / about / base, it will create the `src/pages/about/index.njk` page, extending `src/layouts/base.njk`</p>
</details>

<details>
  <summary>Layout</summary>
  <p>Will ask for the layout's name (in slug format). Il will scaffold a layout boilerplate in `src/layouts/name.nkj`, with ///_Hyperscript and zouMacros included, plus the "main block" where the pages will be loaded.</p>
</details>

<details>
  <summary>Partial</summary>
  <p>Will ask for the file name to  be created. Say you answer 'footer', it will create the `src/partials/footer.njk` file, that you could then include where needed with {% include 'src/partials/footer.njk' %}.</p>
</details>
