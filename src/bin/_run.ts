
import path from "path";
import fs from "fs";
import c from 'chalk';
import { Terminal } from "../lib/Terminal";
import { findConfigFile } from "../Utils";
import { program } from "commander";
import { DEFAULT_CNF_NAME } from "../Constants";
import * as CNF from "../../types/config";

export default (argv: string[]) => {

    program
        .argument('[config]', 'Configuration file location', DEFAULT_CNF_NAME)
        .configureOutput({
            writeOut: (str) => process.stdout.write(str),
            writeErr: (str) => process.stdout.write(Terminal.formatError(true, true, str.replace('error:', 'Error:').replace("'\n", "' ")))
        })
        .action((configFile: string) => {

            const [fullConfigPath, found] = findConfigFile(configFile);
            if (!found) return Terminal.error(true, true, c.red(`Error: Missing configuration file. Use "xilo init <config-file>" to create a basic config file.\n${c.gray('File ' + configFile)}`));
        
            initProgram(fullConfigPath);

        })


    program.parse(['_', '_', ...argv]);

}


function initProgram(fullConfigPath: string) {

    const config: CNF.Config = require(fullConfigPath);

    console.log(config)

}