
import path from "path";
import fs from "fs";
import c from 'chalk';
import { Terminal } from "../lib/Terminal.js";
import { program } from "commander";
import * as cst from "../Constants.js";

import type * as CNF from "../../types/config";

export default (argv: string[]) => {

    const getConfig = (file: string): [string, true] | [null, false] => { 

        // Make sure the path is absolute and default to CWD if it isn't
        let filePath = !path.isAbsolute(file)
            ? path.join(process.cwd(), file)
            : file;
            
        // Append the default "xilo.config" file name to the path if it doesn't
        // point to a specific file.
        if (fs.lstatSync(filePath).isDirectory())
            filePath = path.join(filePath, cst.CNF_BASE);

        // Add the default extname if not specified
        if (!['.js', '.ts'].includes(path.extname(file)))
            filePath = `${filePath}${cst.CNF_EXT}`;

        return fs.existsSync(filePath)
            ? [filePath, true]
            : [null, false]
        
    }

    program
        .argument('[config]', 'Configuration file location', cst.CNF_NAME)
        .configureOutput({
            writeOut: (str) => process.stdout.write(str),
            writeErr: (str) => process.stdout.write(Terminal.formatError(true, true, str.replace('error:', 'Error:').replace("'\n", "' ")))
        })
        .action((configFile: string) => {

            const [fullConfigPath, found] = getConfig(configFile);
            if (!found) return Terminal.error(true, true, c.red(`Error: Missing configuration file. Use "xilo init <config-file>" to create a basic config file.\n${c.gray('File ' + configFile)}`));
        
            initProgram(fullConfigPath);

        })

    program.parse(['_', '_', ...argv]);

}


function initProgram(fullConfigPath: string) {

    const config: CNF.Config = require(fullConfigPath);

    console.log(config)

}