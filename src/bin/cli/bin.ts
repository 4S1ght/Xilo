#!/usr/bin/env node

import path from 'path';
import c from 'chalk';
import { Terminal } from '../Terminal.js';
import * as util from '../Utils.js';

import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

process.title = "Xilo"

// ==============================================================


// Specifies the list of available commands
// An error is thrown if a command is used that's not on this list.
const modules: string[] = [
    'help',
    'run', 
    'init'
];

const helpModule = util.getAbsURL(__dirname, "_help.js").href;

// ==============================================================

(async function main() {
    
    const argv = process.argv.slice(2, process.argv.length);
    const command = argv[0];

    if (command === undefined) {
        const module = await import(helpModule);
        return (module.default || module)(true);
    }

    if (modules.includes(command)) {
        const modulePath = util.getAbsURL(__dirname, `_${command}.js`).href;
        const moduleArgv = argv.slice(1, argv.length);
        const module = await import(modulePath);
        return (module.default || module)(moduleArgv);
    }

    Terminal.error(
        true, true, 
        c.red(`Unknown command "${command}".`), 
        c.grey('\nPlease refer to the help section using the "help" command.')
    )

})();
