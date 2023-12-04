# Zou! CLI - SSG

Scaffold a custom Zou! SSG project and more, with interactive prompt (pages, git, deploy, ...)

*— Zou! is a french interjection that stands for: JustDoIt! GoAhead!*

Simple SSG setup, with close to zero configuration or dependencies but flexible enough to craft web projects or fire a quick sandbox and try things from a curated list of CDN's, Macros & Mixins.


Everything is "watched/live served" then optimized for production in the `/public` folder, ready to go on Vercel, Netlify or a good'ol FTP. No JS framework, no mega-bundler, almost nothing new to learn beyond HTML, CSS, JS yet it does the job "out of the box". #HaveFun


| -Folder- | -Purpose-    |
| --- | --- |
| **Bin:** | db.js will scan files and create an object from the Frontmatters |
| **Data:** | Add data in .js / load in zou.config.js / use in .njk templates |
| **Layouts:** | General .njk templates, composed with partials and more |
| **Macros:** | Styled components, functionalities, (many possibilities) |
| **Pages:** | Extending a layout. The main element with dynamic content |
| **Partials:** | Sub-pages to be included in others |
| **Scripts:** | The enty points for the .js or .ts files |
| **Static:** | Assets to be copied to public, generally images |
| **Styles:** | SCSS / Tailwind. Whatever flavor you like |



## Scaffold a new Zou! project

From a terminal, just call:

```
npx zou create myWebsite
```

or first go 

```
npm install -g zoucli
```

*this would install Zou! globally or update it to the newest version, and eventually you coud strip the `npx` part from the calls.*

### The prompt will ask:

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

## Pages database file auto-generated from frontmatter

On `npm run dev`, `npm run build` or directly from the root with `node bin/db`, Zou! will scan the /public folder for .html pages, and transform the HTML-frontmatter into the 'pages' object, stored and exporterd from /src/data/db.js

- Each frontmatter object expecting at least 'title' and 'url' (here the date is a timestamp for now) [https://timestamp.online/](https://timestamp.online/)

  ```
  <!-- src/pages/blog/article-one/index.njk -->
  {% block frontMatter %}
  title: Article One
  url: /blog/article-one
  date: 1701621848
  tags: [one, two, racoon]
  {% endblock %}
  ```
  
- becomes an entry in the pages object

    ```
  // src/data/db.js
  module.exports.pages = [
    {
      "title": "Article One",
      "url": "/blog/article-one",
      "date": 1701621848,
      "tags": [
        "one",
        "two",
        "racoon"
      ]
    }
  ]
  ```

- then is injected into the 'data' object for .njk files
  
    ```
  // zou.config.js
  
  /* Import Data file*/       
  const db = require('./src/data/db.js');
  
  /* Create the data object */
  const data = {
    appName: 'myWebsite',
    pages: db.pages,
  };     
  ```

## Collections and more via custom Nunjucks filters

<details>
  <summary><strong>urlInc('blog/') : </strong>  Collection of any page where the 'url' field includes a pattern</summary>
  <p>Usage: <code>{% for post in data.pages | urlInc('blog/') %}...</code> Then inside we have access to {{ post.title }}, {{ post.url }}... We  can nest the related tags if they exists, with something like <code>{% for tags in post.tags %}...</code> from inide the first loop. It can be virtually anything, as long as it can find some matching results.</p>
</details>

<details>
  <summary><strong>urlIs('/blog/article-one') : </strong>  Extracting the frontmatter data of a signle page</summary>
  <p>Usage: <code>{% for page in data.pages | urlIs('/') %}...</code> It can wrap everyting inside the {% block main %} and give acces to things like related categories/tags, or whatever else usefull from the frontmatter. A classic example would be blog posts pages files.</p>
</details>

<details>
  <summary><strong>limitFromTo(0, 5) : </strong>  Limitintg the results we recieve from *data.pages*</summary>
  <p>Usage: <code>{% for page in data.pages | limitFromTo(0, 5) %}...</code> will produce an array with the first 5 elements. To offset the list, obviously go for a grater than zero starting point</p>
</details>

<details>
  <summary><strong>reverse : </strong>  Builtin Nunjuck handy filter</summary>
  <p>Usage: <code>{% for pages in data.pages | reverse %}...</code> just that. The array, in reverse, newest first.</p>
</details>

<details>
  <summary><strong>SuperCombo : </strong>  The 5 most recent posts :)</summary>
  <p>Usage: <code>{% for posts in data.pages | reverse | urlInc('blog/') | limitFromTo(0, 5) %}...</code> Easy.</p>
</details>

<details>
  <summary><strong>tags : </strong>  A pre-filtered list of uniques tags</summary>
  <p>Usage: <code>{% for tag in tags %}<a href="/posts-about/{{ tag }}">{{ tag }}</a>{% endfor %}</code> It exctracts uniques occurences from the `tags: [one, two, racoon]` lines in the frontmatters.</p>
</details>

<details>
  <summary><strong>withTag('racoon') : </strong>  Collection of all pges having a word in their `tags`</summary>
  <p>Usage: <code>{% for posts in data.pages | withTag('racoon') %}...</code> This can create the lists of posts on pages like `/posts-about/racoon` so a visitor could see when clicking on a tag link.</p>
</details>

## Navigation

Navigations lists of links are stored in `src/data/nav.js` like the navMain block:

```
// src/data/nav.js
module.exports.navMain = [
  {
    url: "/",
    label: "Home",
  },
  {
    url: "/blog",
    label: "Blog",
  },
];
```

Then made available to the temlates in `zou.config.js` 

```
// zou.config.js

/* Import Data file*/       
const nav = require('./src/data/nav.js');

/* Add to the data object */
const data = {
  appName: 'myWebsite',
  navMain: nav.navMain,
};     
```

That way, in any template or partial like a header, we can just:

```
// someFile.njk

<ul>
{% for link in navMain %}
  <li><a href="{{ link.url }}">{{ link.label }}</a></li>
{% endfor %}
</ul>
};     
```

We can duplicate the block in `src/data/nav.js` and repeat the rest of the steps, to create things like `navFooter`, `navSocials` or whatever other list.



## Scaffold a new Page

From a terminal, just call:

```
zou make:file
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
zou git:save
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
zou deploy:vercel
```

It will build the project, move into `/public` and call `vercel deploy --prod`. The first time it will setup the distant project or link to an existant, and the next ones will just upload the website.

If you have "strange characters" in the terminal, just do the first deploy directly by `cd public && vercel deploy --prod`. From here, the deploy:vercel from the root will roll. *Nothing is "borken" just Bash commands running from Node via zh wraper*.


## Manual Deploy to Netlify

Be sure to have Netlify CLI installed: `npm install netlify-cli -g`. 

```
zou deploy:netlify
```

It will build the project, move into `/public` and call `netlify deploy --prod` for a [Manual Deploy](https://docs.netlify.com/cli/get-started/#manual-deploys). 

One approach is to [drop here](https://app.netlify.com/drop) the `public/` folder after running `npm run build` the first time, and change the name on Netlify to match with your project. > Go inside the public/ folder, call `netlify link` and link them.

Next times from the root of your local project `npx zou deploy:netlify` will be enough, build & deploy simple command. To save your code ...*zou git:save*


---


Related Docs, *just in case*: [Nunjucks](https://mozilla.github.io/nunjucks/templating.html), [Openprops](https://open-props.style/#getting-started), [Hyperscript](https://hyperscript.org/docs/#basics), [SCSS](https://sass-lang.com/documentation/variables/), [zouMixins](https://github.com/AndiKod/zouMixins), [Tailwind](https://tailwindcss.com/docs/installation), [Typescript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html). 

Via [zouMacros](https://github.com/AndiKod/zouMacros): [AlpineJS](https://alpinejs.dev/start-here), [htmX](https://htmx.org/), [Pocketbase](https://pocketbase.io/docs/), [ChotaCSS](https://jenil.github.io/chota/#docs), [BonsaiCSS](https://www.bonsaicss.com/), [Bulma](https://bulma.io/documentation/), [Bootstrap](https://getbootstrap.com/docs/5.3/getting-started/introduction/) Comming soon: [Supabase](https://supabase.com/docs/guides/database/overview), [Planetscale](https://planetscale.com/docs).



## Changelog

**1.1.0**<br>
Added the `deploy:vercel`, `deploy:netlify`, `git:save` commands and fixed the postbuild script.

**1.1.1**<br>
Fixed some misspelled filenames causing troubles with Tailwind & Typescript. It's fine now.

**1.2.0**<br>
- Added FrontMatter support to the pages in the templates
- Automatic 'database' object with the data from the frontmatter
- Collections, Tags, limitFromTo(), withTag('something'), ... Nunjucks filters
- Navigation objects generating navMain, navFooter,...
- and maybe other things I can't remenber