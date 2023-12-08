#!/usr/bin/env node

// Imports
import chalk from "chalk";
import { input } from '@inquirer/prompts';
import select, { Separator } from '@inquirer/select';
import confirm from '@inquirer/confirm';
import checkbox from '@inquirer/checkbox';
import {$} from 'zx';
import rawlist from '@inquirer/rawlist';
import fs from 'fs';
import path from 'path';
import process from "process";

import { URL } from 'url'; // in Browser, the URL in native accessible on window
const __filename = new URL('', import.meta.url).pathname;
// Will contain trailing slash
const __dirname = new URL('.', import.meta.url).pathname;


/*
*   --- Header ---
*/

console.log(chalk.bold.green("-== Zou! CLI ==-"));
console.log(
  chalk.red("HTML") +
    "," +
    chalk.blue("CSS") +
    "," +
    chalk.yellow("JS") +
    " & " +
    chalk.magenta("FUN\n")
);


/*
*   --- Routing & Validation ---
*/

// Validate initial input (projectName)
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error("Check docs: github");
  process.exit(1); //an error occurred
}
/*
else if (args.length > 2 && args[2] !== '-y') {
  console.error("No spaces please. myProject, my-file, is the way ;)");
  process.exit(1); //an error occurred
}
else if (args.length > 2 && args[2] !== '-tw') {
  console.error("No spaces please. myProject, my-file, is the way ;)");
  process.exit(1); //an error occurred
}
*/

// #create
else if (args[0] == "create") {
/*
*
*  Scaffold a new Project in it's folder
*  npx zou create myWebsite
*
*/

// Initialize variables
let author = "";
let styles = "";
let scripts = "";
let sassDoc = "";
let jsDoc = "";
let tests = "";
let vscode = "";
let install = "";





let projectName = args[1];
const project = `./${projectName}`;


/*
*    If args[2] === -y > auto assigns values, else assign what comes from prompt
*/

if (args[2] === '-y') {

  author = "DevMysterio";
  styles = "scss";
  scripts = "js";
  sassDoc = false;
  jsDoc = false;
  tests = false;
  vscode = true;
  install = false;

  if (args[3] === '-vsc') {
    $`cd ${project} && code .`;
  }

} else if (args[2] === '-tw') {

  author = "DevMysterio";
  styles = "tailwind";
  scripts = "js";
  sassDoc = false;
  jsDoc = false;
  tests = false;
  vscode = true;
  install = false;

  if (args[3] === '-vsc') {
    $`cd ${project} && code .`;
  }

} else if (args[2] === '-full') {

  author = "DevMysterio";
  styles = "scss";
  scripts = "js";
  sassDoc = true;
  jsDoc = true;
  tests = true;
  vscode = true;
  install = false;

  if (args[3] === '-vsc') {
    $`cd ${project} && code .`;
  }

} else {



    /*
    *   --- Prompt ---
    */

    const answers = {
      //project: await input({ message: "Project: " }),
      author: await input({ message: "Author: ", default: "DevMysterio" }),
      styles: await select({
        message: 'What CSS flavor?',
        choices: [
          { 
            name: 'SCSS', 
            value: 'scss',
            description: '...or CSS, works too.', 
          },
          { 
            name: 'Tailwind', 
            value: 'tailwind',
            description: '...the Tailwind way. ',
          },
        ],
      }),
      scripts: await select({
        message: 'What Scripting?',
        choices: [
          { 
            name: 'Javascript', 
            value: 'js',
            description: 'Processed by ESBuild'
          },
          { 
            name: 'Typescript', 
            value: 'ts',
            description: 'Compiled via TSC script'
          },
        ],
      }),
      sassDoc: await confirm({message: 'Enable sassDoc generation?', default: false}),
      jsDoc: await confirm({message: 'Enable JSDoc & TypesCheck?', default: false}),
      tests: await confirm({message: 'Enable JS Testing with Jest?', default: false}),

      vscode: await select({
        message: 'Open in VSCode?',
        choices: [
          { 
            name: 'Sure, why not', 
            value: 'yep',
            description: 'Will "code ." from root'
          },
          { name: 'Nope', 
            value: 'nope',
            description: 'I\'ll do it, my way.'
          },
        ],
      }),
      install: await confirm({message: 'Auto npm-install/run?', default: false})
    };


  author = answers.author;
  styles = answers.styles;
  scripts = answers.scripts;
  sassDoc = answers.sassDoc;
  jsDoc = answers.jsDoc;
  tests = answers.tests;
  vscode = answers.vscode;
  install = answers.install;

}



/*
*   --- Creating Folders ---
*/


fs.mkdirSync(`./${project}`);
fs.mkdirSync(project + '/bin');
fs.mkdirSync(project + '/src');
fs.mkdirSync(project + '/src/data');
fs.mkdirSync(project + '/src/layouts');
fs.mkdirSync(project + '/src/macros');
fs.mkdirSync(project + '/src/pages');
fs.mkdirSync(project + '/src/partials');
fs.mkdirSync(project + '/src/scripts');
fs.mkdirSync(project + '/src/static');
fs.mkdirSync(project + '/src/styles');

if (tests) {
  fs.mkdirSync(project + '/tests');
}
if (sassDoc || jsDoc) {
  if(!fs.existsSync(__dirname + '/docs')) {
    fs.mkdirSync(project + '/docs');
  }
}


/*
*   --- Creating Files ---
*/


/*
*   --- BIN ---
*/

// FILE: --- bin/db.js ---

let pgBinDb = project + '/bin/db.js';
let pgBinDbContent = `// bin/db.js

const dirTree = require("directory-tree");
const fs = require('fs');
const fm = require('html-frontmatter');

const files = [];

dirTree('./public', {extensions:/\.html$/}, (item, PATH, stats) => {
  let path = __dirname +'../../'+ PATH;
  let content = fm(fs.readFileSync(path, 'utf-8'));
  files.push(content);
});

const filesJson = JSON.stringify(files, null, 2);
const content = 'module.exports.pages = ' + filesJson;

//fs.rm('./src/data/db.js');
fs.writeFile('./src/data/db.js', content, (err) => {
  if(err) { 
    console.log(err); 
  } else {
    console.log('Done!');
  }
})`;
fs.writeFile(pgBinDb, pgBinDbContent, (err) => {
  if (err) { console.error(err); }
  // bin/db.js Created!
});



/*
*   --- DATA ---
*/

// FILE: --- src/data/nav.js ---

let pgDataNav = project + '/src/data/nav.js';
let pgDataNavContent = `// src/data/nav.js

module.exports.navMain = [
  {
    url: "/",
    label: "Home",
  },
  {
    url: "/blog",
    label: "Blog",
  },
];`;
fs.writeFile(pgDataNav, pgDataNavContent, (err) => {
  if (err) { console.error(err); }
  // src/data/nav.js Created!
});

// FILE: --- src/data/store.js ---

let pgDataStore = project + '/src/data/store.js';
let pgDataStoreContent = `// src/data/nav.js

module.exports.links = [
  {
    url: "https://github.com/AndiKod/zoucli",
    label: "Zou!CLI Github",
  },
  {
    url: "hhttps://mozilla.github.io/nunjucks/templating.html",
    label: "Nunjucks",
  },
  {
    url: "https://www.npmjs.com/package/zoumacros",
    label: "zouMacros",
  },
];`;
fs.writeFile(pgDataStore, pgDataStoreContent, (err) => {
  if (err) { console.error(err); }
  // src/data/store.js Created!
});




/*
*   --- LAYOUTS ---
*/

// #layout
// --- FILE: src/layouts/base.njk ---

let cssFile = "";
let jsFile = "";
let cdn = "";
let darkSwitch = "";

if (styles == 'scss') {
  cssFile = '<link rel="stylesheet" href="/main.css" />';
  darkSwitch = `
    <script>
      // function to set a given theme/color-scheme
      function setTheme(themeName) {
          localStorage.setItem('zouTheme', themeName);
          document.body.classList.add(themeName);
      }
      // function to toggle between light and dark theme
      function toggleTheme() {
          if (localStorage.getItem('zouTheme') === 'dark') {
              setTheme('light');
              location.reload()
          } else {
              setTheme('dark');
              location.reload()
          }
      }
      // IIFE to set the theme on initial load
      (function () {
          if (localStorage.getItem('zouTheme') === 'dark') {
              setTheme('dark');
          } else {
              setTheme('light');
          }
      })();
    </script>
    `;
} else if (styles == 'tailwind') {
  cssFile = '<link rel="stylesheet" href="/tw.css" />';
}

if (scripts == 'js') {
  jsFile = '<script src="/script.js"></script>';
} else if (scripts == 'ts') {
  jsFile = '<script src="/main.js"></script>';
}


/*
for (let item in answers.cdn) {
  cdn += `{{ cdn.pkg('${answers.cdn[item]}') }}\n\t\t`
}
*/

let pgLayoutsBase = project + '/src/layouts/base.njk';
let pgLayoutsBaseContent = `<!--
{%block  frontMatter %}{% endblock %}  
-->
<!DOCTYPE html>
<html lang="en">
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="generator" content="Zou!" />
    <title>{% block pageTitle %}{% endblock %} {{data.appName}}</title>
    <meta name="description" content="{% block pageDesc %}{% endblock %}">
    <link rel="author" href="/humans.txt" />
    <link rel="icon" href="/favicon.ico" />
    <!-- Fonts for the Welcome page -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Boogaloo&family=Caveat&display=swap" rel="stylesheet">
    ${cssFile}
    <script src=\"https://unpkg.com/hyperscript.org@0.9.12\"></script>

    {% import '../../node_modules/zoumacros/lib/cdn.njk'as cdn %}
    ${cdn}
    
    {% block headStyles %}{% endblock %}
    {% block headScripts %}{% endblock %}
    <!-- https://blog.hubspot.com/marketing/meta-tags -->
    </head>
    <body>

    {% block main %}{% endblock %}

    ${jsFile}
    ${darkSwitch}
    </body>
</html>`;
fs.writeFile(pgLayoutsBase, pgLayoutsBaseContent, (err) => {
  if (err) { console.error(err); }
  // src/layouts/base.njk Created!
});


/*
*   --- PAGES ---
*/


// FILE: --- pages/index.njk ---

let indexPage = "";

if (styles == 'scss') {

  indexPage = `
  <figure onclick="toggleTheme()" style="padding-top:2rem;">
    <img src="https://icongr.am/feather/sun.svg?size=24&color=var(--text)">
  </figure>
  <main style="display:grid;justify-content: center;text-align:center;margin-top:3rem;">
    <figure>
      <img src="https://zoujs.vercel.app/static/images/z.png" width="50px">
    </figure>
    <h1>Zou!<span>JS</span></h1>
    <h2 title="Click on me ;)" _="on click call alert('///_Hyperscript is Working!')">${projectName} project by ${author}</h2>
    <nav style="margin-top:1.5rem;font-family:sans-serif;">
      / {% for link in data.links %} <a href="{{link.url}}">{{link.label}}</a> / {% endfor %} ...
    </nav>
  </main>

  <!-- Minimal styles -->
  <style>
    body {
      background: var(--bg);
      background-size: 400% 400%;
      animation: gradient 5s ease infinite;
      height: 100vh;
    }
    @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
    }
    h1 {
      font-family: boogaloo;
      font-size: clamp(4rem, 16vw, 8rem);
      text-shadow: 2px 2px 0 rgba(134, 194, 50, 0.6);
    }
    h1 > span {
      font-size: clamp(1.8rem, 8vw, 4rem);
      padding-left: clamp(0.2rem, 1vw, 1rem);
      text-shadow: 2px 2px 0 rgba(245,190,37, 0.6);
    }
    h2 {
      font-family: Caveat;
      font-size: clamp(1.6rem, 6vw, 3rem);
    }
    a,
    a:visited,
    a:active {
      color: var(--text-1);
      text-decoration: underline;
    }
  </style>`;
  
} else if (styles == 'tailwind') {

  indexPage = `
  <main style="display:grid;justify-content: center;text-align:center;margin-top:3rem;">
    <img src="https://zoujs.vercel.app/static/images/z.png" width="50px" class="mx-auto mt-8">
    <h1>Zou!<span>JS</span></h1>
    <h2 title="Click on me ;)" _="on click call alert('///_Hyperscript is Working!')">${projectName} project by ${author}</h2>
    <nav style="margin-top:1.5rem;font-family:sans-serif;">
      / {% for link in data.links %} <a href="{{link.url}}">{{link.label}}</a> / {% endfor %} ...
    </nav>
  </main>

  <!-- Minimal styles -->
  <style>
    body {
      color: ivory;
      background: linear-gradient(-45deg, #d84d23, #e2af22, #86c232);
      background-size: 400% 400%;
      animation: gradient 5s ease infinite;
      height: 100vh;
    }
    @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
    }
    h1 {
      font-family: boogaloo;
      font-size: clamp(4rem, 16vw, 8rem);
      text-shadow: 2px 2px 0 rgba(134, 194, 50, 0.6);
    }
    h1 > span {
      font-size: clamp(1.8rem, 8vw, 4rem);
      padding-left: clamp(0.2rem, 1vw, 1rem);
      text-shadow: 2px 2px 0 rgba(245,190,37, 0.6);
    }
    h2 {
      font-family: Caveat;
      font-size: clamp(1.6rem, 6vw, 3rem);
    }
    a,
    a:visited,
    a:active {
      color: var(--text-1);
      text-decoration: underline;
    }
  </style>`;

}

let pgPagesIndex = project + '/src/pages/index.njk';
let pgPagesIndexContent = `{% extends "src/layouts/base.njk" %}

// Data that goes into data/db.js pages object
// It enables collections and more via zou.config.js filters
{% block frontMatter %}
title: Homepage
url: /
type: page
{% endblock %}

{% block pageTitle %} 👋 {% endblock %}
{% block pageDesc %}My Zou! project{% endblock %}

{# Actual visible content on the Page #}
{% block main %}
${indexPage}
{% endblock %}`;
fs.writeFile(pgPagesIndex, pgPagesIndexContent, (err) => {
  if (err) throw err;
  // pages/index.njk Created!
});


/*
*   --- SCRIPTS ---
*/

/* 
*  Creating the Docs folder & index, 
*  only if it's not a Tailwing + TypeScript project
*/

if (jsDoc || sassDoc) {


  // FILE: --- /docs/index.html ---

let indexDocs = project + '/docs/index.html';
let indexDocsContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JS & SCSS Docs</title>
  <!-- the props -->
  <link rel="stylesheet" href="https://unpkg.com/open-props"/>
  <!-- optional imports that use the props -->
  <link rel="stylesheet" href="https://unpkg.com/open-props/normalize.min.css"/>
</head>
<body>
  <header>
    <h1>Docs frontpage</h1>
  <p>Just a page with links to both folders.</p>
  </header>
  
  <div class="topic">
    <a href="./jsdoc/">
      <h2>JS Doc</h2>
    </a>
    <iframe src="./jsdoc/" title="JS doc"></iframe>
  </div>

  
  <div class="topic">
    <a href="./sassdoc/">
      <h2>SCSS Doc</h2>
    </a>
    <iframe src="./sassdoc/" title="JS doc"></iframe>
  </div>


  
  <style>
    body {
      padding-block: var(--size-6);
    }
    header {
      max-width: 80ch;
      margin-inline: auto;
      padding: var(--size-6);
    }
    .topic {
      max-width: 90%;
      margin-inline: auto;
    }
    .topic:last-of-type {
      margin-bottom: 2rem;
    }
    iframe {
      border-radius: var(--radius-2);
      width: 100%;
      height: 35rem;
    }

    .b {
      border: 1px solid lightgreen;
    }
  </style>  
</body>
</html>`;
fs.writeFile(indexDocs, indexDocsContent, (err) => {
  if (err) throw err;
  // docs/index.html Created!
});

}

/*
*  --- jsDoc ---
*/


if (jsDoc) {
  // FILE: --- tsconfig.json ---

  fs.mkdirSync(project + '/docs/jsTuts');  

  let tsConfig = project + '/tsconfig.json';
  let tsConfigContent = `{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "strict": true
  }
  }`;
  fs.writeFile(tsConfig, tsConfigContent, (err) => {
    if (err) throw err;
    // tsconfig.json Created!
  });

  // FILE: --- jsdoc.json ---

  let jsdocConfig = project + '/jsdoc.json';
  let jsdocConfigContent = `{
    "source": {
      "include": ["src"],
      "includePattern": ".js$",
      "excludePattern": "(node_modules/|public/|docs)_"
    },
    "templates": {
        "cleverLinks": false,
        "monospaceLinks": false
    },
    "plugins": ["plugins/markdown"],
    "recurseDepth": 10,
    "opts": {
      "recurse": true,
      "destination": "./docs/jsdoc/",
      "tutorials": "./docs/jsTuts/",
      "readme": "./docs/jsReadme.md"
    }
  }`;
  fs.writeFile(jsdocConfig, jsdocConfigContent, (err) => {
    if (err) throw err;
    // jsdoc.json Created!
  });


  // FILE: --- docs/jsReadme.md ---

  let jsReadme = project + '/docs/jsReadme.md';
  let jsReadmeContent = `## Readme

  Some markdown ...`;
  fs.writeFile(jsReadme, jsReadmeContent, (err) => {
    if (err) throw err;
    // docs/jsReadme.md Created!
  });

  // FILE: --- docs/jsTuts/tut-one.md ---

  let tutOne = project + '/docs/jsTuts/tut-one.md';
  let tutOneContent = `## Ok, here we go

  Some markdown ...`;
  fs.writeFile(tutOne, tutOneContent, (err) => {
    if (err) throw err;
    // docs/jsTuts/tut-one.md Created!
  });

  // FILE: --- docs/jsReadme.md ---

  let tutJson = project + '/docs/jsTuts/tutorial.json';
  let tutJsonContent = `{
    "tut-one": {
      "title": "First Tutorial"
    }
  }`;
  fs.writeFile(tutJson, tutJsonContent, (err) => {
    if (err) throw err;
    // docs/jsTuts/tutorial.json Created!
  });
} // -- End jsDoc & TypesCheck section --




if (scripts == 'js') {

  // FILE: --- scr/scripts/main.js ---

  let fileMainJs = project + '/src/scripts/main.js';
  let fileMainJsContent = `// Drop your JS here ;)`;
  fs.writeFile(fileMainJs, fileMainJsContent, (err) => {
    if (err) throw err;
    // scr/scripts/main.js Created!
  });
  
} else if (scripts == 'ts') {

  // FILE: --- scr/scripts/main.ts ---

  let fileMainTs = project + '/src/scripts/main.ts';
  let fileMainTsContent = `// Drop tour TS here ;)`;
  fs.writeFile(fileMainTs, fileMainTsContent, (err) => {
    if (err) throw err;
    // scr/scripts/main.js Created!
  });

  // FILE: --- tsconfig.js ---

  // #tsconfig
  let tsConfig = project + '/tsconfig.json';
  let tsConfigContent = `{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig.json to read more about this file */

    /* Projects */
    // "incremental": true,                              /* Enable incremental compilation */
    // "composite": true,                                /* Enable constraints that allow a TypeScript project to be used with project references. */
    // "tsBuildInfoFile": "./",                          /* Specify the folder for .tsbuildinfo incremental compilation files. */
    // "disableSourceOfProjectReferenceRedirect": true,  /* Disable preferring source files instead of declaration files when referencing composite projects */
    // "disableSolutionSearching": true,                 /* Opt a project out of multi-project reference checking when editing. */
    // "disableReferencedProjectLoad": true,             /* Reduce the number of projects loaded automatically by TypeScript. */

    /* Language and Environment */
    "target": "ES6",                                  /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */
    // "lib": [],                                        /* Specify a set of bundled library declaration files that describe the target runtime environment. */
    // "jsx": "preserve",                                /* Specify what JSX code is generated. */
    // "experimentalDecorators": true,                   /* Enable experimental support for TC39 stage 2 draft decorators. */
    // "emitDecoratorMetadata": true,                    /* Emit design-type metadata for decorated declarations in source files. */
    // "jsxFactory": "",                                 /* Specify the JSX factory function used when targeting React JSX emit, e.g. 'React.createElement' or 'h' */
    // "jsxFragmentFactory": "",                         /* Specify the JSX Fragment reference used for fragments when targeting React JSX emit e.g. 'React.Fragment' or 'Fragment'. */
    // "jsxImportSource": "",                            /* Specify module specifier used to import the JSX factory functions when using \`jsx: react-jsx*\`.\` */
    // "reactNamespace": "",                             /* Specify the object invoked for \`createElement\`. This only applies when targeting \`react\` JSX emit. */
    // "noLib": true,                                    /* Disable including any library files, including the default lib.d.ts. */
    // "useDefineForClassFields": true,                  /* Emit ECMAScript-standard-compliant class fields. */

    /* Modules */
    "module": "commonjs",                                /* Specify what module code is generated. */
    // "rootDir": "./",                                  /* Specify the root folder within your source files. */
    // "moduleResolution": "node",                       /* Specify how TypeScript looks up a file from a given module specifier. */
    // "baseUrl": "./",                                  /* Specify the base directory to resolve non-relative module names. */
    // "paths": {},                                      /* Specify a set of entries that re-map imports to additional lookup locations. */
    // "rootDirs": [],                                   /* Allow multiple folders to be treated as one when resolving modules. */
    // "typeRoots": [],                                  /* Specify multiple folders that act like \`./node_modules/@types\`. */
    // "types": [],                                      /* Specify type package names to be included without being referenced in a source file. */
    // "allowUmdGlobalAccess": true,                     /* Allow accessing UMD globals from modules. */
    // "resolveJsonModule": true,                        /* Enable importing .json files */
    // "noResolve": true,                                /* Disallow \`import\`s, \`require\`s or \`<reference>\`s from expanding the number of files TypeScript should add to a project. */

    /* JavaScript Support */
    // "allowJs": true,                                  /* Allow JavaScript files to be a part of your program. Use the \`checkJS\` option to get errors from these files. */
    // "checkJs": true,                                  /* Enable error reporting in type-checked JavaScript files. */
    // "maxNodeModuleJsDepth": 1,                        /* Specify the maximum folder depth used for checking JavaScript files from \`node_modules\`. Only applicable with \`allowJs\`. */

    /* Emit */
    // "declaration": true,                              /* Generate .d.ts files from TypeScript and JavaScript files in your project. */
    // "declarationMap": true,                           /* Create sourcemaps for d.ts files. */
    // "emitDeclarationOnly": true,                      /* Only output d.ts files and not JavaScript files. */
    // "sourceMap": true,                                /* Create source map files for emitted JavaScript files. */
    // "outFile": "./",                                  /* Specify a file that bundles all outputs into one JavaScript file. If \`declaration\` is true, also designates a file that bundles all .d.ts output. */
    "outDir": "./public",                               /* Specify an output folder for all emitted files. */
    // "removeComments": true,                           /* Disable emitting comments. */
    // "noEmit": true,                                   /* Disable emitting files from a compilation. */
    // "importHelpers": true,                            /* Allow importing helper functions from tslib once per project, instead of including them per-file. */
    // "importsNotUsedAsValues": "remove",               /* Specify emit/checking behavior for imports that are only used for types */
    // "downlevelIteration": true,                       /* Emit more compliant, but verbose and less performant JavaScript for iteration. */
    // "sourceRoot": "./src/scripts",                                 /* Specify the root path for debuggers to find the reference source code. */
    // "mapRoot": "",                                    /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,                          /* Include sourcemap files inside the emitted JavaScript. */
    // "inlineSources": true,                            /* Include source code in the sourcemaps inside the emitted JavaScript. */
    // "emitBOM": true,                                  /* Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files. */
    // "newLine": "crlf",                                /* Set the newline character for emitting files. */
    // "stripInternal": true,                            /* Disable emitting declarations that have \`@internal\` in their JSDoc comments. */
    // "noEmitHelpers": true,                            /* Disable generating custom helper functions like \`__extends\` in compiled output. */
    // "noEmitOnError": true,                            /* Disable emitting files if any type checking errors are reported. */
    // "preserveConstEnums": true,                       /* Disable erasing \`const enum\` declarations in generated code. */
    // "declarationDir": "./",                           /* Specify the output directory for generated declaration files. */
    // "preserveValueImports": true,                     /* Preserve unused imported values in the JavaScript output that would otherwise be removed. */

    /* Interop Constraints */
    // "isolatedModules": true,                          /* Ensure that each file can be safely transpiled without relying on other imports. */
    // "allowSyntheticDefaultImports": true,             /* Allow 'import x from y' when a module doesn't have a default export. */
    "esModuleInterop": true,                             /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables \`allowSyntheticDefaultImports\` for type compatibility. */
    // "preserveSymlinks": true,                         /* Disable resolving symlinks to their realpath. This correlates to the same flag in node. */
    "forceConsistentCasingInFileNames": true,            /* Ensure that casing is correct in imports. */

    /* Type Checking */
    "strict": true,                                      /* Enable all strict type-checking options. */
    // "noImplicitAny": true,                            /* Enable error reporting for expressions and declarations with an implied \`any\` type.. */
    // "strictNullChecks": true,                         /* When type checking, take into account \`null\` and \`undefined\`. */
    // "strictFunctionTypes": true,                      /* When assigning functions, check to ensure parameters and the return values are subtype-compatible. */
    // "strictBindCallApply": true,                      /* Check that the arguments for \`bind\`, \`call\`, and \`apply\` methods match the original function. */
    // "strictPropertyInitialization": true,             /* Check for class properties that are declared but not set in the constructor. */
    // "noImplicitThis": true,                           /* Enable error reporting when \`this\` is given the type \`any\`. */
    // "useUnknownInCatchVariables": true,               /* Type catch clause variables as 'unknown' instead of 'any'. */
    // "alwaysStrict": true,                             /* Ensure 'use strict' is always emitted. */
    // "noUnusedLocals": true,                           /* Enable error reporting when a local variables aren't read. */
    // "noUnusedParameters": true,                       /* Raise an error when a function parameter isn't read */
    // "exactOptionalPropertyTypes": true,               /* Interpret optional property types as written, rather than adding 'undefined'. */
    // "noImplicitReturns": true,                        /* Enable error reporting for codepaths that do not explicitly return in a function. */
    // "noFallthroughCasesInSwitch": true,               /* Enable error reporting for fallthrough cases in switch statements. */
    // "noUncheckedIndexedAccess": true,                 /* Include 'undefined' in index signature results */
    // "noImplicitOverride": true,                       /* Ensure overriding members in derived classes are marked with an override modifier. */
    // "noPropertyAccessFromIndexSignature": true,       /* Enforces using indexed accessors for keys declared using an indexed type */
    // "allowUnusedLabels": true,                        /* Disable error reporting for unused labels. */
    // "allowUnreachableCode": true,                     /* Disable error reporting for unreachable code. */

    /* Completeness */
    // "skipDefaultLibCheck": true,                      /* Skip type checking .d.ts files that are included with TypeScript. */
    "skipLibCheck": true                                 /* Skip type checking all .d.ts files. */
  }
}`;
  fs.writeFile(tsConfig, tsConfigContent, (err) => {
    if (err) throw err;
    // tsconfig.js Created!
  });
  
} 


/*
*   --- STYLES ---
*/

if (styles == 'tailwind') {

  // FILE: --- tailwind.config.js ---

  let twConfig = project + '/tailwind.config.js';
  let twConfigContent = `/** @type {import('tailwindcss').Config} **/

  module.exports = {
      content: ["./src/**/*.{html,njk,js}","./public/**/*.{html,js}"],
      theme: {
      extend: {},
    },
    plugins: [],
  }`;
  fs.writeFile(twConfig, twConfigContent, (err) => {
    if (err) throw err;
    // tailwind.config.ts Created!
  });

  // FILE: --- src/styles/tw-input.css ---

  let twInput = project + '/src/styles/tw-input.css';
  let twInputContent = `
  @tailwind base;
  @tailwind components;
  @tailwind utilities;`;
  fs.writeFile(twInput, twInputContent, (err) => {
    if (err) throw err;
    // src/styles/tw-input.css Created!
  });
  
} else if (styles == 'scss') {



// 7-1 Folders Structure
fs.mkdirSync(project + '/src/styles/abstract');
fs.mkdirSync(project + '/src/styles/base');
fs.mkdirSync(project + '/src/styles/components');
fs.mkdirSync(project + '/src/styles/layout');
fs.mkdirSync(project + '/src/styles/pages');
fs.mkdirSync(project + '/src/styles/themes');
fs.mkdirSync(project + '/src/styles/vendors');
fs.mkdirSync(project + '/src/styles/utility');
fs.mkdirSync(project + '/src/styles/freestyle');


  /// ABSTRACT

  // FILE: --- src/styles/abstract/_variables.scss --- 
  let scssVars = project + '/src/styles/abstract/_variables.scss';
  let scssVarsContent = `/* Variables */`;
  fs.writeFile(scssVars, scssVarsContent, (err) => {
    if (err) throw err;
    // src/styles/abstract/_variables.scss Created!
  });

  // FILE: --- src/styles/abstract/_functions.scss --- 
  let scssFunc = project + '/src/styles/abstract/_functions.scss';
  let scssFuncContent = `/* Functions */`;
  fs.writeFile(scssFunc, scssFuncContent, (err) => {
    if (err) throw err;
    // src/styles/abstract/_functions.scss Created!
  });

  // FILE: --- src/styles/abstract/_mixins.scss --- 
  let scssMixins = project + '/src/styles/abstract/_mixins.scss';
  let scssMixinsContent = `/* Mixins */`;
  fs.writeFile(scssMixins, scssMixinsContent, (err) => {
    if (err) throw err;
    // src/styles/abstract/_mixins.scss Created!
  });

  // FILE: --- src/styles/abstract/_index.scss --- 
  let scssAbstract = project + '/src/styles/abstract/_index.scss';
  let scssAbstractContent = `/* Abstract */
  @forward "variables";
  @forward "functions";
  @forward "mixins";`;
  fs.writeFile(scssAbstract, scssAbstractContent, (err) => {
    if (err) throw err;
    // src/styles/main.scss Created!
  });

  /// BASE

  // FILE: --- src/styles/base/_reset.scss --- 
  let scssReset = project + '/src/styles/base/_reset.scss';
  let scssResetContent = `/* Reset */`;
  fs.writeFile(scssReset, scssResetContent, (err) => {
    if (err) throw err;
    // src/styles/base/_reset.scss Created!
  });

  // FILE: --- src/styles/base/_typography.scss --- 
  let scssTypography = project + '/src/styles/base/_typography.scss';
  let scssTypographyContent = `/// The general Typography defaults
/// @todo Write some real code here
  body {
    color: var(--text-1);
  }
  `;
  fs.writeFile(scssTypography, scssTypographyContent, (err) => {
    if (err) throw err;
    // src/styles/base/_typography.scss Created!
  });

  // FILE: --- src/styles/base/_index.scss --- 
  let scssBase = project + '/src/styles/base/_index.scss';
  let scssBaseContent = `/* Base */
  @forward "reset";
  @forward "typography";`;
  fs.writeFile(scssBase, scssBaseContent, (err) => {
    if (err) throw err;
    // src/styles/base/_index.scss Created!
  });

  /// COMPONENTS

  // FILE: --- src/styles/components/_buttons.scss --- 
  let scssButtons = project + '/src/styles/components/_buttons.scss';
  let scssButtonsContent = `/* Buttons */`;
  fs.writeFile(scssButtons, scssButtonsContent, (err) => {
    if (err) throw err;
    // src/styles/components/_buttons.scss Created!
  });

  // FILE: --- src/styles/components/_index.scss --- 
  let scssComponents = project + '/src/styles/components/_index.scss';
  let scssComponentsContent = `/* Components */
  @forward "buttons";`;
  fs.writeFile(scssComponents, scssComponentsContent, (err) => {
    if (err) throw err;
    // src/styles/components/_index.scss Created!
  });

  /// LAYOUT

  // FILE: --- src/styles/layout/_header.scss --- 
  let scssHeader = project + '/src/styles/layout/_header.scss';
  let scssHeaderContent = `/* Header */`;
  fs.writeFile(scssHeader, scssHeaderContent, (err) => {
    if (err) throw err;
    // src/styles/layout/_header.scss Created!
  });

  // FILE: --- src/styles/layout/_footer.scss --- 
  let scssFooter = project + '/src/styles/layout/_footer.scss';
  let scssFooterContent = `/* Footer */`;
  fs.writeFile(scssFooter, scssFooterContent, (err) => {
    if (err) throw err;
    // src/styles/layout/_footer.scss Created!
  });

  // FILE: --- src/styles/layout/_index.scss --- 
  let scssLayout = project + '/src/styles/layout/_index.scss';
  let scssLayoutContent = `/* Layout */
  @forward "header";
  @forward "footer";`;
  fs.writeFile(scssLayout, scssLayoutContent, (err) => {
    if (err) throw err;
    // src/styles/layout/_index.scss Created!
  });

  /// PAGES

  // FILE: --- src/styles/pages/_home.scss --- 
  let scssHome = project + '/src/styles/pages/_home.scss';
  let scssHomeContent = `/* Home */`;
  fs.writeFile(scssHome, scssHomeContent, (err) => {
    if (err) throw err;
    // src/styles/pages/_home.scss Created!
  });

  // FILE: --- src/styles/pages/_index.scss --- 
  let scssPages = project + '/src/styles/pages/_index.scss';
  let scssPagesContent = `/* Pages */
  @forward "home";`;
  fs.writeFile(scssPages, scssPagesContent, (err) => {
    if (err) throw err;
    // src/styles/pages/_index.scss Created!
  });


  /// THEMES

  // FILE: --- src/styles/themes/_theme.scss --- 
  let scssTheme = project + '/src/styles/themes/_theme.scss';
  let scssThemeContent = `/* Theme */

  // Dark theme
body.dark {
  --bg: linear-gradient(-45deg, #d84d23, #e2af22, #86c232);
  --brand: var(--lime-6);
  --surface-1: var(--sand-10);
  --text-1: var(--sand-0);
}

// Light theme
body.light {
  --bg: linear-gradient(-45deg, #e7c6bb, rgb(173, 226, 188), #dcf0c1);
  --brand: var(--lime-6);
  --surface-1: var(--sand-0);
  --text-1: var(--sand-10);
}`;
  fs.writeFile(scssTheme, scssThemeContent, (err) => {
    if (err) throw err;
    // src/styles/themes/_theme.scss Created!
  });

  // FILE: --- src/styles/themes/_index.scss --- 
  let scssThemes = project + '/src/styles/themes/_index.scss';
  let scssThemesContent = `/* Themes */
  @forward "theme";`;
  fs.writeFile(scssThemes, scssThemesContent, (err) => {
    if (err) throw err;
    // src/styles/themes/_index.scss Created!
  });

  /// VENDORS

  // FILE: --- src/styles/vendors/_open-props.scss --- 
  let scssOProps = project + '/src/styles/vendors/_open-props.scss';
  let scssOPropsContent = `/* OpenProps */
/// @see https://open-props.style/

@import "https://unpkg.com/open-props";
@import "https://unpkg.com/open-props/normalize.min.css";
  `;
  fs.writeFile(scssOProps, scssOPropsContent, (err) => {
    if (err) throw err;
    // src/styles/vendors/_open-props.scss Created!
  });

  // FILE: --- src/styles/vendors/_index.scss --- 
  let scssVendors = project + '/src/styles/vendors/_index.scss';
  let scssVendorsContent = `/* Vendors */
  @forward "open-props";`;
  fs.writeFile(scssVendors, scssVendorsContent, (err) => {
    if (err) throw err;
    // src/styles/vendors/_index.scss Created!
  });

  /// UTILITY

  // FILE: --- src/styles/utility/_classes.scss --- 
  let scssClasses = project + '/src/styles/utility/_classes.scss';
  let scssClassesContent = `/* Classes */`;
  fs.writeFile(scssClasses, scssClassesContent, (err) => {
    if (err) throw err;
    // src/styles/utility/_classes.scss Created!
  });

  // FILE: --- src/styles/utility/_index.scss --- 
  let scssUtility = project + '/src/styles/utility/_index.scss';
  let scssUtilityContent = `/* Pages */
  @forward "classes";`;
  fs.writeFile(scssUtility, scssUtilityContent, (err) => {
    if (err) throw err;
    // src/styles/utility/_index.scss Created!
  });

  /// FREESTYLE

  // FILE: --- src/styles/freestyle/_getWild.scss --- 
  let scssWild = project + '/src/styles/freestyle/_getWild.scss';
  let scssWildContent = `/* Get Wild :) Random stuff */`;
  fs.writeFile(scssWild, scssWildContent, (err) => {
    if (err) throw err;
    // src/styles/freestyle/_getWild.scss Created!
  });

  // FILE: --- src/styles/freestyle/_index.scss --- 
  let scssFreestyle = project + '/src/styles/freestyle/_index.scss';
  let scssFreestyleContent = `/* Freestyle */
  @forward "getWild";`;
  fs.writeFile(scssFreestyle, scssFreestyleContent, (err) => {
    if (err) throw err;
    // src/styles/freestyle/_index.scss /jsCreated!
  });


  









  // FILE: --- src/styles/main.scss ---

  let scssMain = project + '/src/styles/main.scss';
  let scssMainContent = `

  @use "abstract";
  @use "base";
  @use "components";
  @use "layout";
  @use "pages";
  @use "themes";
  @use "vendors";
  @use "utility";
  @use "freestyle";

`;
  fs.writeFile(scssMain, scssMainContent, (err) => {
    if (err) throw err;
    // src/styles/main.scss Created!
  });

  

  

}




/*
*   --- Config Files ---
*/


// FILE: --- zou.config.js ---

let zouConfig = project + '/zou.config.js';
let zouConfigContent = `// zou.config.js

// Get Lodash in
const _ = require('lodash');

/* Import Data file*/
const store = require("./src/data/store.js");        
const db = require('./src/data/db.js');       
const nav = require('./src/data/nav.js');
const tags = _.uniqBy( _.flatMap(db.pages, 'tags') );

/* Data to use from .njk files */
/* <h2>{{data.appName}}</h2> */
/* {% for link in data.links %} ... {% endfor %}*/

const data = {
  appName: '${projectName}',
  links: store.links,
  pages: db.pages,
  navMain: nav.navMain,
  tags: tags,
};


module.exports = {
  "options": {
    /**
     * A path to the file containing data for the template.
     * If you want to pass an object, use "render.context" instead.
     */
    //"data": "src/njk/data/data.js",
    /**
     * A hook that's called before calling nunjucks.render()
     * but after nunjucks.configure().
     *
     * Return false to skip rendering (and writing).
     */
    beforeRender (nunjucksEnv, renderName, renderData) {
      let nunjucks = this;

      nunjucksEnv.addFilter('shorten', function(str, count) {
          return str.trim().slice(0, count || 5);
      });

      // Get data of a particular Tag (from frontmatter)
      // {% for posts data.pages | withTag('racoon') %}
      nunjucksEnv.addFilter('withTag', function(input, tag){

        function byTag(input) {
          return input.tags.includes(tag);
        }

        return input.filter(byTag);
      });

      // Collections. Get pages with urls including a pattern
      // {% for posts data.pages | urlInc('/blog/') %}
      nunjucksEnv.addFilter('urlInc', function(input, url){

        function byUrl(input) {
          return input.url.includes(url);
        }

        return input.filter(byUrl);
      });

      // Frontmatter data of the curent page
      // {% for posts data.pages | urlIs('/blog/article-one') %}
      nunjucksEnv.addFilter('urlIs', function(input, url){

        function byUrl(input) {
          return input.url === url;
        }

        return input.filter(byUrl);
      });

      // Limt the amount of results from/to. 3 most recent posts:
      // {% for posts in data.pages | reverse | urlInc('/blog/') | limitFormTo(0, 3) %}
      // The selection function works on numbers and strings too.
      nunjucksEnv.addFilter('limitFromTo', function(input, from, limit) {
        'use strict';
        if(typeof limit !== 'number'){
          return input;
        }
        if(typeof input === 'string'){
          if(limit >= 0){
            return input.substring(from, limit);
          } else {
            return input.substr(limit);
          }
        }
        if(Array.isArray(input)){
          limit = Math.min(limit, input.length);
          if(limit >= 0){
            return input.splice(from, limit);
          } else {
            return input.splice(input.length + limit, input.length);
          }
        }
        return input;
      });

    },
    /**
     * A hook that's called after calling nunjucks.render()
     * but before writing to a file.
     *
     * Return false to skip writing.
     */
    beforeWrite (destinationFilepath, renderResult) { let nunjucks = this; }
  },

  /**
   * The following keys are members of Nunjucks.
   * To modify any parameter or see possible values,
   * please check https://mozilla.github.io/nunjucks/api.html
   */

  // Executes nunjucks.configure([path], [options]).
  "configure": {
    "path": undefined,
    "options": {
      "autoescape": true,
      "throwOnUndefined": false,
      // ...
    }
  },

  // Executes nunjucks.render(name, [context], [callback]).
  "render": {
    "name": undefined, // You shouldn't change this.
    /**
     * An object literal containing the data for the template.
     * If you need to load data from a file, use "options.data" instead.
     * If you decide to use "options.data" too, this property will be assigned to it.
     */
    "context": {data},
    "callback": () => {} // Not modificable.
  }

};`;
fs.writeFile(zouConfig, zouConfigContent, (err) => {
  if (err) throw err;
  // zou.config.js Created!
});



/*
*   --- Package.json ---
*/


// FILE: --- package.json ---

let twScript = "";
let scssScript = "";
let jsScript = "";
let tsScript = "";
let sassPkg = "";
let twPkg = "";
let jestScript = "";
let jestPkg = "";

let docsScript = "";
let sassdocScript = "";
let jsdocScript = "";
let jsdocPkg = "";




// --- Styles ---

if (styles == "scss") {

  scssScript = `"w-sass": "sass  --no-source-map --watch src/styles:public",
    "b-sass": "sass  --no-source-map src/styles:public --style compressed",`;
  sassPkg = '"sass": "^1.69.4",';

} else {

  twScript = `"w-tw": "npx tailwindcss -i ./src/styles/tw-input.css -o ./public/tw.css --watch",
    "b-tw": "npx tailwindcss -i ./src/styles/tw-input.css -o ./public/tw.css --minify",`;
  twPkg = '"tailwindcss": "^3.3.3",'; 

} 

// --- Scripts ---

if (scripts == "js") {

  jsScript = `"w-js": "npx esbuild src/scripts/main.js --outfile=public/script.js --bundle --watch",
    "b-js": "npx esbuild src/scripts/main.js --outfile=public/script.js --bundle --minify",`;

} else {

  tsScript = `"w-ts": "npx tsc --watch",
    "b-ts": "npx tsc && npx esbuild public/main.js --minify --outfile=public/main.min.js",`;

}

// --- Jest ---

if (tests) {
  jestScript = `"test": "jest",`;
  jestPkg = `"jest": "^29.7.0",`
} 


// --- jsDoc ---

if (jsDoc) {
  jsdocScript = `"d-js": "jsdoc -c jsdoc.json",`;
  jsdocPkg = `"jsdoc": "^4.0.2",
    "typescript": "^5.3.2",`;

  if (!docsScript) {
    docsScript = `"docs": "npm-run-all --parallel d-*",`;
  }
} 

// --- sassDoc ---

if (sassDoc) {
  sassdocScript = `"d-sass": "sassdoc src/styles/**/* -d ./docs/sassdoc",`;

  if (!docsScript) {
    docsScript = `"docs": "npm-run-all --parallel d-*"`;
  }
} 



// --- Packages




let pkgJson = project + '/package.json';
let pkgJsonContent = `{
  "name": "${projectName}",
  "version": "1.0.0",
  "description": "Say some words about your project",
  "author": "${author}",
  "license": "ISC",
  "main": "index.js",
  "scripts": {
    ${twScript}
    ${scssScript}
    ${jsScript}
    ${tsScript}
    ${jestScript}
    ${jsdocScript}
    ${sassdocScript}
    ${docsScript}
    "b-pages": "nunjucks-to-html --config zou.config.js --baseDir src/pages",
    "c-static": "copyfiles -u 1 \\"./src/static/**/*\\" \\"public\\"",
    "c-root": "copyfiles -u 1 \\"./src/favicon.ico\\" \\"./src/*.txt\\"   \\"public\\"",
    "copy": "npm-run-all --parallel c-*",
    "w-pages": "onchange \\"./src/**/*\\" -- npm run b-pages",
    "bin": "node bin/db",
    "watch": "npm-run-all --parallel w-*",
    "build": "npm-run-all bin --parallel b-*",
    "serve": "alive-server public",
    "dev": "npm-run-all bin copy b-pages --parallel watch serve",
    "postbuild": "postcss public/*.css -u autoprefixer cssnano -r --no-map" 
  },
  "dependencies": {},
  "devDependencies": {
    ${sassPkg}
    ${twPkg}
    ${jestPkg}
    ${jsdocPkg}
    "nunjucks-to-html": "^1.1.0",
    "onchange": "^7.1.0",
    "copyfiles": "^2.4.1",
    "directory-tree": "^3.5.1",
    "html-frontmatter": "^1.6.1",
    "lodash": "^4.17.21",
    "npm-run-all": "^4.1.5",
    "alive-server": "^1.3.0",
    "postcss": "^8.4.31",
    "postcss-cli": "^10.1.0",
    "autoprefixer": "^10.4.16",
    "cssnano": "^6.0.1",
    "zoumacros": "^1.3.0",
    "zoumixins": "^1.0.0"
  }
}`;
fs.writeFile(pkgJson, pkgJsonContent, (err) => {
  if (err) throw err;
  // package.json Created!
});





if (install) {

  console.log(chalk.bold.magenta('\nLet\'s Go!') + " ..."+ chalk.italic('Zou! steaming, let him cook ;)') )
  console.log('||| Building. Give it a little minute.\n')
  if (vscode == 'yep') {
    $`cd ${projectName} && code . && npm install && npm run dev`;
  } else {
    $`cd ${projectName} && npm install && npm run dev`;
  } 
   
} else {

  if (vscode == 'yep') {
    console.log(chalk.bold.magenta('\nLet\'s Go!') + " ..."+ chalk.italic('When ready:') )
    console.log(chalk.bold('pnpm')+', yarn or npm install,')
    console.log('...then '+ chalk.italic('run dev')+'\n')

    $`cd ${projectName} && code .`;
  } else {
    console.log(chalk.bold.magenta('\nLet\'s Go!') + " ..."+ chalk.italic('When ready:') )
    console.log(`> cd ${projectName}`)
    console.log(chalk.bold('pnpm')+', yarn or npm install,')
    console.log('...then '+ chalk.italic('run dev')+'\n')
  }

}

// End:  zou create myProject
} 

// #newFile ---------------------------------------------------------
else if (args[0] == "make:file") {
/*
*
*  Scaffold a new Page in src/pages
*  npx zou create myWebsite
*
*/

/*
*   --- Prompt ---
*/

const answersPage = {
  //project: await input({ message: "Project: " }),
  //file: await input({ message: "Name: ", default: "newFile" }),
  type: await select({
    message: 'What Type?',
    choices: [ 
      { 
        name: 'Page', 
        value: 'page',
        description: '...the main content of a page',
      },
      { 
        name: 'Partial', 
        value: 'partial',
        description: '... .njk fragment to include elsewhere',
      },
      { 
        name: 'Layout', 
        value: 'layout',
        description: '...the HTML around the page\'s content. ',
      },
    ],
  }),
};


console.log(`Ok, we\'ll create the ${answersPage.file} ${answersPage.type}`)


if (answersPage.type == "layout") {

  const ansLayout = {
    //project: await input({ message: "Project: " }),
    file: await input({ message: "Name: ", default: "newLayout" }),
  };

  // FILE: --- newLayout ---
  let newLayout = `./src/layouts/${ansLayout.file}.njk`;
  let newLayoutContent = `<!--
{%block  frontMatter %}{% endblock %}   
-->
<!DOCTYPE html>
<html lang="en">
    <head x-data="data">
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="generator" content="Zou!" />
    <title>{% block pageTitle %}{% endblock %} {{data.appName}}</title>
    <meta name="description" content="{% block pageDesc %}{% endblock %}">
    <link rel="author" href="/humans.txt" />
    <link rel="icon" href="/favicon.ico" />
    <link rel="stylesheet" href="/main.css" />
    <script src="https://unpkg.com/hyperscript.org@0.9.12"></script>
    {% block headStyles %}{% endblock %}
    {% block headScripts %}{% endblock %}
    </head>
    <body>

    {% block main %}{% endblock %}

    <script src="/script.js"></script> 
    </body>
</html>`;
  fs.writeFile(newLayout, newLayoutContent, (err) => {
    if (err) throw err;
    console.log(chalk.green('Done!'));
    console.log(`./src/layouts/${ansLayout.file}.njk`+ chalk.italic(' created'))
  });

} else if (answersPage.type == "page") {

  // --- Prompt for information ---
  // Title  = ansPage.title
  // URL    = ansPage.url
  // Layout = ansPage.layout
  const ansPage = {
    title: await input({ message: "Title: ", default: "New page" }),
    url: await input({ message: "URL: ", default: "/new-page" }),
    layout: await input({ message: "Layout: ", default: "base" }),
  };

    // FILE: --- newPage ---

    let newPage = `./src/pages${ansPage.url}/index.njk`;
    let newPageContent = `{% extends "src/layouts/${ansPage.layout}.njk" %}

{% block frontMatter %}
title: ${ansPage.title}
url: ${ansPage.url}
tags: []
{% endblock %}    

{% block pageTitle %} ${ansPage.title} {% endblock %}
{% block pageDesc %}{% endblock %}

{% block main %}
{% for page in data.pages | urlIs('${ansPage.url}') %}

  <h1>{{page.title}}</h1>

{% endfor %}  
{% endblock %}`;
    fs.mkdirSync(`./src/pages${ansPage.url}`, { recursive: true });
    fs.writeFile(newPage, newPageContent, (err) => {
      if (err) throw err;
      console.log(chalk.green('Done!'));
      console.log(`./src/pages${ansPage.url}/index.njk`+ chalk.italic(' created'))
    });

} else if (answersPage.type == "partial") {

  // --- Prompt for information ---
  // File  = ansPartial.file
  const ansPartial = {
    file: await input({ message: "File: ", default: "some-partial" }),
  };

  // FILE: --- newPartial ---
  let newPartial = `./src/partials/${ansPartial.file}.njk`;
  let newPartialContent = `{# ${newPartial} #}`;
  fs.writeFile(newPartial, newPartialContent, (err) => {
    if (err) throw err;
    console.log(chalk.green('Done!'));
    console.log(`./src/partials/${ansPartial.file}.njk`+ chalk.italic(' created'))
  });

}

}

// #deployVercel ---------------------------------------------------------
else if (args[0] == "deploy:vercel") {
/*
*
*  Trigger the Vercel deploy from dist/
*
*/
await $`npm run build && cd public && vercel deploy --prod`
}

// #deployNetlify ---------------------------------------------------------
else if (args[0] == "deploy:netlify") {
/*
*
*  Trigger the Netlify deploy from dist/
*
*/
await $`npm run build && cd public && netlify deploy --prod`
}

// #gitSave ---------------------------------------------------------
else if (args[0] == "git:save") {
/*
*
*  Commit all changes and push to Origin
*
*/
const d = new Date();
let day = d.getDate();
let month = d.getMonth() + 1;
let hours = d.getHours();
let minutes = d.getMinutes();

let commitMessage = `Update from ${month}/${day} at ${hours}:${minutes}`;

const answersGit = {
  message: await input({ 
    message: "Commit Message: ",
    default: commitMessage 
  }),
  branch: await input({ 
    message: "Branch: ", 
    default: "master" 
  }),
};



await $`git add . && git commit -m "${answersGit.message}" && git push origin ${answersGit.branch} `
}