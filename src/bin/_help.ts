
import c from 'chalk'
import fs from 'fs'
import path from 'path'
import * as cst from '../other/Constants.js'
import * as util from '../other/Utils.js'
import * as colors from '../other/Colors.js'

import * as url from 'url'
const __filename = url.fileURLToPath(import.meta.url)
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

//

const _name     = colors.green
const _param    = colors.green
const _opt      = colors.grey

const XILO =        colors.blue.bold("Xilo")
const VERSION =     colors.blue     (JSON.parse(fs.readFileSync(util.getAbsURL(__dirname, '../../../package.json'), 'utf-8')).version)
const HELP_S =      colors.green   ("xilo help")
const INIT =        colors.green   ("xilo init <path>")
const PREFIX =      colors.green   (cst.T_PREFIX_SMALL)

const getUptime = () => process.uptime().toFixed(2) + 's'
    
//

const SPLASH_MAIN = [
    ``,
    `   ${XILO} ${VERSION}   %uptime%`,
    ``,
    `   ${PREFIX}  Type ${HELP_S} to list out available commands.`,
    `   ${PREFIX}  Or create a default config file with ${INIT}.`,
    ``
]

const PLATFORM_SUPPORT = [
    `   WARNING: Officially supported platforms include: ${cst.SUPPORTED_PLATFORMS.join(', ')}.`,
    `   "${process.platform}" is not supported and issues might appear during operation.`,
    ``
]

const SPLASH_HELP = `

${XILO} ${VERSION}   %uptime%

Note: Use --help To display a list of accepted parameters for specific commands.
__________________________________________________________________________________

init   <config>         Creates a template config file in a specified location.
                        Defaults to _./${cst.CNF_FILE_NAME}_
       --force, -f      *Foce the template file.*
       --template, -t   *Specifies configuration file boilerplate.*

run    <config>         Starts the manager using the specified config file.
                        Defaults to _./${cst.CNF_FILE_NAME}_
`

//

export default (disableHelp: boolean) => {

    if (disableHelp === true) {
        console.log(SPLASH_MAIN.join('\n').replace("%uptime%", getUptime()))
        if (!cst.SUPPORTED_PLATFORMS.includes(process.platform)) 
            console.log(c.red(`${PLATFORM_SUPPORT.join('\n')}`))
    }
    else {

        let formattedText = SPLASH_HELP
            .replace(/\n(?<x>\w+)*/g,                _name("\n$1"))
            .replace(/\<(?<x>[a-zA-z ?]+)*\>/g,      _param("<$1>"))
            .replace(/\*(?<x>[a-zA-z ._<>*/]+)*\*/g, _opt("$1"))
            .replace(/\_(?<x>[a-zA-z ./]+)*\_/g,     c.underline("$1"))
            .replace(/--(?<x>[A-z]+)*/g,             _opt('--$1'))
            .replace(/-(?<x>[A-z]+)*/g,              _opt('-$1'))

            .replace("%uptime%", getUptime())

        console.log(formattedText)
    }

}
