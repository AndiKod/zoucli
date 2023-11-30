# Zou! CLI

Scaffold a custom Zou! SSG Boilerplate and more with interactive prompt (pages, git, deploy, ...).

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

## Save to Git

From the project's root folder:

```
npx zou git:save
```

It will prompt for a `Commit message` or generate one as `Update from month/day at h:m`, ask for the branch name and defaulting to `master`.

It will basically do *(in one go)* the equivalent of:

```
git add .
git commit -m "commitMessage"
git push origin branch
```

The basic "take everything and throw it on master", that's why it's called by a generic *git:save* like a Ctr/Cmd+S. Other git:commands might come later.

## Manual Deploy to Vercel

From the project's root folder:

```
npx zou deploy:vercel
```

It will build the project, move into `/public` and call `vercel deploy --prod`. The first time it will setup the distant project or link to an existant, and the next ones will just upload the website.

If you have "strange characters" in the terminal, just do the first deploy directly by `cd public && vercel deploy --prod`. From here, the deploy:vercel from the root will roll. *Nothing is "borken" just Bash commands running from Node via zh wraper*.


## Manual Deploy to Netlify

Be sure to have Netlify CLI installed: `npm install netlify-cli -g`. 

```
npx zou deploy:netlify
```

It will build the project, move into `/public` and call `netlify deploy --prod` for a [Manual Deploy](https://docs.netlify.com/cli/get-started/#manual-deploys). 

One approach is to [drop here](https://app.netlify.com/drop) the `public/` folder after running `npm run build` the first time, and change the name on Netlify to match with your project. > Go inside the public/ folder, call `netlify link` and link them.

Next times from the root of your local project `npx zou deploy:netlify` will be enough, build & deploy simple command. To save your code ...*zou git:save*


---

## Changelog

**1.1.0**<br>
Added the `deploy:vercel`, `deploy:netlify`, `git:save` commands and fixed the postbuild script.

**1.1.1**<br>
Fixed some misspelled filenames causing troubles with Tailwind & Typescript. It's fine now.