
import path from "path"
import fs from "fs"
import Terminal from "../other/Terminal.js"
import { program } from "commander"
import * as cst from "../other/Constants.js"
import * as util from "../other/Utils.js"
import * as c from '../other/Colors.js'
import Program from '../program/Program.class.js'

import type * as CNF from "../types/config"

export default (argv: string[]) => {

    program
        .argument('[config]', 'Configuration file location')
        .configureOutput({
            writeOut: (str) => process.stdout.write(str),
            writeErr: (str) => process.stdout.write(Terminal.formatStaticError(true, true, str.replace('error:', 'Error:').replace("'\n", "' ")))
        })
        .action(async (configPath: string) => {
            
            const [configFile, found] = util.getConfigPath(configPath)
            if (!found) return Terminal.staticError(true, true, c.red(`Error: Missing configuration file. Use "xilo init <config>" to create a basic template.`))
            
            const config = await import(util.getAbsURL(configFile!).href)
            const program = new Program(config.exports || config.default || config)
            await program.start()
            
        })

    program.parse(['_', 'run', ...argv])

}

