
import path from "path"
import fs from "fs"
import { program } from "commander"
import { Terminal } from "../other/Terminal.js"
import * as cst from "../other/Constants.js"
import * as util from '../other/Utils.js'
import * as c from "../other/Colors.js"

import * as url from 'url'
const __filename = url.fileURLToPath(import.meta.url)
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))


export default (argv: string[]) => {

    program
        .argument('[config]', 'Configuration file location')
        .option('-f, --force', 'Forces the creation of the template config file.', false)
        .showSuggestionAfterError(true)
        .configureOutput({
            writeOut: (str) => process.stdout.write(str),
            writeErr: (str) => process.stdout.write(Terminal.formatError(true, true, str.replace('error:', 'Error:').replace("'\n", "' ")))
        })
        .action((config: string | undefined, options: { force: boolean, template: string }) => {

            const cnfPath = util.chooseConfigCreationPath(config)
            const cnfFound = fs.existsSync(cnfPath)

            if (cnfFound && !options.force) {
                return Terminal.error(
                    true, true,
                    c.red(`Error: Another file already exists in this location. Use "--force" to override it.\n${c.grey('File ' + cnfPath)}`)
                )
            }
            if (!cnfFound) {
                fs.mkdirSync(path.dirname(cnfPath), { recursive: true })
            }

            fs.copyFileSync(
                path.join(__dirname, `../../templates/default-config.mjs`),
                path.join(cnfPath)
            )
    
            Terminal.message(true, true, c.green(`${options.force && cnfFound ? 'Overwritten' : 'Created'} config file in ` + c.underline(cnfPath)))
    
        })

    program.parse(['_', 'init', ...argv])

}