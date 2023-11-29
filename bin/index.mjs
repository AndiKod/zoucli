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
import process from "process";


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
else if (args.length > 2) {
  console.error("No spaces please. myProject, my-file, is the way ;)");
  process.exit(1); //an error occurred
}



// #create
else if (args[0] == "create") {
/*
*
*  Scaffold a new Project in it's folder
*  npx zou create myWebsite
*
*/


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
  
  cdn: await checkbox({
    message: 'Play with some CDN',
    choices: [
      new Separator('--- JS ---'),
      {name: 'AlpineJS', value: 'alpinejs'},
      {name: 'PocketBase', value: 'pocketbase'},
      {name: 'htmX', value: 'htmx'},
      new Separator('--- CSS ---'),
      {name: 'Chota', value: 'chota'},
      {name: 'Bonzai', value: 'bonzai'},
      {name: 'Bootstrap', value: 'bootstrap'},
    ]
  }),
  
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
        description: 'I\'ll open it later'
      },
    ],
  }),
  install: await confirm({message: 'Install packages now ?', default: true})
};

/*
*   --- Creating Folders ---
*/

let projectName = args[1];
const project = `./${projectName}`;

fs.mkdirSync(`./${project}`);
fs.mkdirSync(project + '/src');
fs.mkdirSync(project + '/src/data');
fs.mkdirSync(project + '/src/layouts');
fs.mkdirSync(project + '/src/macros');
fs.mkdirSync(project + '/src/pages');
fs.mkdirSync(project + '/src/partials');
fs.mkdirSync(project + '/src/scripts');
fs.mkdirSync(project + '/src/static');
fs.mkdirSync(project + '/src/styles');

/*
*   --- Creating Files ---
*/



/*
*   --- DATA ---
*/

// FILE: --- src/data/store.js ---

let pgDataStore = project + '/src/data/store.js';
let pgDataStoreContent = `// src/data/store.js

module.exports.links = [
  {
    url: "https://github.com/AndiKod/zou",
    label: "Zou!JS Github",
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

// --- FILE: src/layouts/base.njk ---

let cssFile = "";
let jsFile = "";
let cdn = "";
let darkSwitch = "";

if (answers.styles == 'scss') {
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
} else if (answers.styles == 'tailwind') {
  cssFile = '<link rel="stylesheet" href="/maintw.css" />';
}

if (answers.scripts == 'js') {
  jsFile = '<script src="/script.js"></script>';
} else if (answers.scripts == 'ts') {
  jsFile = '<script src="/main.js"></script>';
}


for (let item in answers.cdn) {
  cdn += `{{ cdn.pkg('${answers.cdn[item]}') }}\n\t\t`
}


let pgLayoutsBase = project + '/src/layouts/base.njk';
let pgLayoutsBaseContent = `<!DOCTYPE html>
<html lang="en">
    <head x-data="data">
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

if (answers.styles == 'scss') {

  indexPage = `
  <figure onclick="toggleTheme()">
    <img src="https://icongr.am/feather/sun.svg?size=24&color=var(--text)">
  </figure>
  <main style="text-align:center;">
    <img src="https://zoujs.vercel.app/static/images/z.png" width="50px">
    <h1>Zou!<span>JS</span></h1>
    <h2 title="Click on me ;)" _="on click call alert('///_Hyperscript is Working!')">${projectName} project by ${answers.author}</h2>
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
  
} else if (answers.styles == 'tailwind') {

  indexPage = `
  <main style="text-align:center;">
    <img src="https://zoujs.vercel.app/static/images/z.png" width="50px">
    <h1>Zou!<span>JS</span></h1>
    <h2 title="Click on me ;)" _="on click call alert('///_Hyperscript is Working!')">${projectName} project by ${answers.author}</h2>
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

}

let pgPagesIndex = project + '/src/pages/index.njk';
let pgPagesIndexContent = `{% extends "src/layouts/base.njk" %}
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


if (answers.scripts == 'js') {

  // FILE: --- scr/scripts/main.js ---

  let fileMainJs = project + '/src/scripts/main.js';
  let fileMainJsContent = `// Drop your JS here ;)`;
  fs.writeFile(fileMainJs, fileMainJsContent, (err) => {
    if (err) throw err;
    // scr/scripts/main.js Created!
  });
  
} else if (answers.scripts == 'ts') {

  // FILE: --- scr/scripts/main.ts ---

  let fileMainTs = project + '/src/scripts/main.ts';
  let fileMainTsContent = `// Drop tour TS here ;)`;
  fs.writeFile(fileMainTs, fileMainTsContent, (err) => {
    if (err) throw err;
    // scr/scripts/main.js Created!
  });

  // FILE: --- tsconfig.js ---

  let tsConfig = project + '/tsconfig.js';
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

if (answers.styles == 'tailwind') {

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
  
} else if (answers.styles == 'scss') {

  // FILE: --- src/styles/main.scss ---

  let scssMain = project + '/src/styles/main.scss';
  let scssMainContent = `
@use "_themes";

/*
@use "../../node_modules/zoumixins/cssowl/before" as owl;
.withMixin {
  @include owl.cssowl-before-float("*", 4px 10px 0 0);
}
*/

@import "https://unpkg.com/open-props";

body {
  color: var(--text-1);
}`;
  fs.writeFile(scssMain, scssMainContent, (err) => {
    if (err) throw err;
    // src/styles/main.scss Created!
  });

  // FILE: --- src/styles/_themes.scss ---

  let scssThemes = project + '/src/styles/_themes.scss';
  let scssThemesContent = `// Dark theme
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
  fs.writeFile(scssThemes, scssThemesContent, (err) => {
    if (err) throw err;
    // src/styles/_themes.scss Created!
  });

}


/*
*   --- ZOU Config ---
*/


// FILE: --- zou.config.js ---

let zouConfig = project + '/zou.config.js';
let zouConfigContent = `// zou.config.js

/* Import Data file*/
const store = require("./src/data/store.js");        

/* Data to use from .njk files */
/* <h2>{{data.appName}}</h2> */
/* {% for link in data.links %} ... {% endfor %}*/

const data = {
  appName: '${projectName}',
  links: store.links
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



// --- Styles ---

if (answers.styles == "scss") {

  scssScript = `"w-sass": "sass  --no-source-map --watch src/styles:public",
    "b-sass": "sass  --no-source-map src/styles:public --style compressed",`;
  sassPkg = '"sass": "^1.69.4",';

} else {

  twScript = `"w-tw": "npx tailwindcss -i ./src/styles/tw-input.css -o ./public/tw.css --watch",
    "b-tw": "npx tailwindcss -i ./src/styles/tw-input.css -o ./public/tw.css --minify",`;
  twPkg = '"tailwindcss": "^3.3.3",'; 

} 

// --- Scripts ---

if (answers.scripts == "js") {

  jsScript = `"w-js": "npx esbuild src/scripts/main.js --outfile=public/script.js --bundle --watch",
    "b-js": "npx esbuild src/scripts/main.js --outfile=public/script.js --bundle --minify",`;

} else {

  tsScript = `"w-ts": "npx tsc --watch",
    "b-ts": "npx tsc && npx esbuild public/main.js --minify --outfile=public/main.min.js",`;

}

// --- Packages




let pkgJson = project + '/package.json';
let pkgJsonContent = `{
  "name": "${projectName}",
  "version": "1.0.0",
  "description": "Say some words about your project",
  "author": "${answers.author}",
  "license": "ISC",
  "main": "index.js",
  "scripts": {
    ${twScript}
    ${scssScript}
    ${jsScript}
    ${tsScript}
    "b-pages": "nunjucks-to-html --config zou.config.js --baseDir src/pages",
    "c-static": "copyfiles -u 1 \\"./src/static/**/*\\" \\"public\\"",
    "c-root": "copyfiles -u 1 \\"./src/favicon.ico\\" \\"./src/*.txt\\"   \\"public\\"",
    "copy": "npm-run-all --parallel c-*",
    "w-pages": "onchange \\"./src/**/*\\" -- npm run b-pages",
    "watch": "npm-run-all --parallel w-*",
    "build": "npm-run-all --parallel b-*",
    "serve": "alive-server public",
    "dev": "npm-run-all copy b-pages --parallel watch serve",
    "postbuild": "postcss public/css/*.css -u autoprefixer cssnano -r --no-map"
  },
  "dependencies": {},
  "devDependencies": {
    ${sassPkg}
    ${twPkg}
    "nunjucks-to-html": "^1.1.0",
    "onchange": "^7.1.0",
    "copyfiles": "^2.4.1",
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


if (answers.install) {

  console.log(chalk.bold.magenta('\nLet\'s Go!') + " ..."+ chalk.italic('Zou! steaming, let him cook ;)') )
  if (answers.vscode == 'yep') {
    $`cd ${projectName} && code . && npm install && npm run dev`;
  } else {
    $`cd ${projectName} && npm install && npm run dev`;
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
        name: 'Layout', 
        value: 'layout',
        description: '...the HTML around the page\'s content. ',
      },
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
  let newLayoutContent = `<!DOCTYPE html>
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
    url: await input({ message: "URL: ", default: "new-page" }),
    layout: await input({ message: "Layout: ", default: "base" }),
  };

    // FILE: --- newLayout ---
    let newPage = `./src/pages/${ansPage.url}/index.njk`;
    let newPageContent = `{% extends "src/layouts/${ansPage.layout}.njk" %}
{% block pageTitle %} ${ansPage.title} {% endblock %}
{% block pageDesc %}{% endblock %}

{% block main %}
    <h1>${ansPage.title}</h1>
{% endblock %}`;
    fs.mkdirSync(`./src/pages/${ansPage.url}`);
    fs.writeFile(newPage, newPageContent, (err) => {
      if (err) throw err;
      console.log(chalk.green('Done!'));
      console.log(`./src/pages/${ansPage.url}/index.njk`+ chalk.italic(' created'))
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