#!/usr/bin/env node

// Define "require"
//import { createRequire } from "module";
//const require = createRequire(import.meta.url);

// Getting __dirname in .mjs file
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

// Imports
import chalk from "chalk";
import inquirer from "inquirer";
import { input } from '@inquirer/prompts';
import rawlist from '@inquirer/rawlist';
import {$} from 'zx';

import fs from 'fs';
import path from 'path';

/*
*   --- Header ---
*/

console.log(chalk.magenta.bold("-- Zou!", chalk.yellow("CLI --")));
console.log(
  chalk.red("HTML") +
    "," +
    chalk.blue("CSS") +
    "," +
    chalk.yellow("JS") +
    " & " +
    chalk.magenta("FUN")
);

console.log('--- init ---')

/*
*   --- Prompt ---
*/

const answers = {
  author: await input({ message: "Author: " }),
  styles: await rawlist({
    message: 'What CSS flavor?',
    choices: [
      { name: 'SCSS', value: 'scss' },
      { name: 'Tailwind', value: 'tailwind' },
    ],
  }),
  scripts: await rawlist({
    message: 'What Scripting?',
    choices: [
      { name: 'Javascript', value: 'js' },
      { name: 'Typescript', value: 'ts' },
    ],
  }),
};

console.log(answers.author + " is looking for " + answers.styles + " and " + answers.scripts);

/*
*   --- Creating Folders ---
*/



const dirData = path.join('./data')
const dirLayouts = path.join('./layouts')
fs.mkdirSync(dirData)
fs.mkdirSync(dirLayouts)

/*
*   --- Creating Files ---
*/

if (answers.styles == 'tailwind') {

  let twConfig = path.join('./tailwind.config.js');
  let twConfigContent = `Bla bla`;
  fs.writeFile(twConfig, twConfigContent, (err) => {
    if (err) throw err;
    console.log('Tailwind config created.');
  });
  
}