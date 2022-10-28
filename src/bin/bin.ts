#!/usr/bin/env node

import path from 'path';
import c from 'chalk';
import Terminal from '../lib/Terminal';
// import { BinInitError } from '../Errors';

// ==============================================================

// Specifies the list of available commands
// An error is thrown if a command is used 
// that's not on this list.
const modules: string[] = [
    'help',
    'run', 
    'init'
];

const helpModule = path.join(__dirname, "_help.js");

// ==============================================================

(function main() {
    
    const argv = process.argv.slice(2, process.argv.length);
    const command = argv[0];

    if (command === undefined) {
        const module = require(helpModule);
        return (module.default || module)();
    }

    if (modules.includes(command)) {
        const modulePath = path.join(__dirname, `_${command}.js`);
        const moduleArgv = argv.slice(1, argv.length);
        const module = require(modulePath);
        return (module.default || module)(moduleArgv);
    }

    Terminal.error(
        true, true, 
        c.red(`Unknown command "${command}".`), 
        c.grey('\nPlease refer to the help section using the "help" command.')
    )

})();
