
import path from "path"
import fs from "fs";
import c from "chalk";
import { program } from "commander";

import Terminal from "../lib/Terminal";
import { DEFAULT_CNF_NAME, CNF_TEMPLATE } from "../Constants";


export default (argv: string[]) => {

    program
        .argument('[config]', 'Configuration file location', DEFAULT_CNF_NAME)
        .option('-f, --force', 'Forces the creation of the template config file.', false)
        .showSuggestionAfterError(true)
        .configureOutput({
            writeOut: (str) => process.stdout.write(str),
            writeErr: (str) => process.stdout.write(Terminal.formatError(true, true, str.replace('error:', 'Error:')))
        })
        .action((config: string, options: { force: boolean }) => {

            if (path.extname(config) !== '.js') config = config + '.js';
            const fullPath = path.isAbsolute(config) ? config : path.join(process.cwd(), config);
    
            if (fs.existsSync(fullPath) && !options.force) return Terminal.error(
                true, true,
                c.red(`Error: Another file already exists in this location. Use "--force" to override it.\n${c.gray('File ' + fullPath)}`),
            );
    
            fs.writeFileSync(fullPath, CNF_TEMPLATE, 'utf-8');
            Terminal.message(true, true, c.green(`${options.force ? 'Overwritten' : 'Created'} config file in ` + c.underline(fullPath)))
    
        });

    program.parse(['_', '_', ...argv]);
}