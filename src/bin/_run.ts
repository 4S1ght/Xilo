
import path from "path";
import fs from "fs";
import c from 'chalk';
import { Terminal } from "../lib/Terminal.js";
import { program } from "commander";
import * as cst from "../Constants.js";
import * as util from "../Utils.js"

import type * as CNF from "../../types/config";

import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));


export default (argv: string[]) => {

    program
        .argument('[config]', 'Configuration file location')
        .configureOutput({
            writeOut: (str) => process.stdout.write(str),
            writeErr: (str) => process.stdout.write(Terminal.formatError(true, true, str.replace('error:', 'Error:').replace("'\n", "' ")))
        })
        .action(async (configPath: string) => {

            const configFile = util.getConfigPath(configPath);
            console.log(configFile)
            const found = fs.existsSync(configFile!);

            if (!found) return Terminal.error(true, true, c.red(`Error: Missing configuration file. Use "xilo init <config>" to create a basic config file.`));
        
            const config: CNF.Config = await import(util.getAbsURL(configFile!).href);
            console.log(config)

        })

    program.parse(['_', '_', ...argv]);

}

