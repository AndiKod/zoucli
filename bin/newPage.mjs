#!/usr/bin/env node

// Imports
import chalk from "chalk";
import { input } from '@inquirer/prompts';
import select, { Separator } from '@inquirer/select';
import fs from 'fs';

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

/*
*   --- Prompt ---
*/

const answers = {
  //project: await input({ message: "Project: " }),
  page: await input({ message: "Page Name: ", default: "DevMysterio" }),
  layout: await select({
    message: 'What CSS flavor?',
    choices: [
      { 
        name: 'Base', 
        value: 'base',
        description: '...or CSS, works too.', 
      },
      { 
        name: 'Whatever', 
        value: 'another',
        description: '...the Tailwind way. ',
      },
    ],
  }),
};

console.log(answers.page + " page, extending the " + answers.layout + " layout ");


/*
*   --- Creating Files ---
*/



/*
*   --- DATA ---
*/

// FILE: --- src/data/store.js ---

let pgName ='./pages/' + answers.page + '.njk';
let pgContent = `Hey`;
fs.writeFile(pgName, pgNameContent, (err) => {
  if (err) { console.error(err); }
  // src/data/store.js Created!
});

