
import path from "path"
import fs from "fs";
import c from "chalk";
import { program } from "commander";
import { Terminal } from "../lib/Terminal.js";
import * as cst from "../Constants.js";
import * as util from '../Utils.js'

import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));


export default (argv: string[]) => {

    program
        .argument('[config]', 'Configuration file location')
        .option('-f, --force', 'Forces the creation of the template config file.', false)
        .showSuggestionAfterError(true)
        .configureOutput({
            writeOut: (str) => process.stdout.write(str),
            writeErr: (str) => process.stdout.write(Terminal.formatError(true, true, str.replace('error:', 'Error:').replace("'\n", "' ")))
        })
        .action((config: string | undefined, options: { force: boolean }) => {

            const cnfPath = util.chooseConfigCreationPath(config);
            const found = fs.existsSync(cnfPath);

            if (found && !options.force) {
                return Terminal.error(
                    true, true,
                    c.red(`Error: Another file already exists in this location. Use "--force" to override it.\n${c.gray('File ' + cnfPath)}`)
                )
            }
            if (!found) {
                fs.mkdirSync(path.dirname(cnfPath), { recursive: true })
            }
    
            fs.writeFileSync(cnfPath!, cst.CNF_TEMPLATE, 'utf-8');
            Terminal.message(true, true, c.green(`${options.force && found ? 'Overwritten' : 'Created'} config file in ` + c.underline(cnfPath)))
    
        });

    program.parse(['_', '_', ...argv]);
}