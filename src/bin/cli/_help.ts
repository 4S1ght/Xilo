
import c from 'chalk';
import fs from 'fs';
import path from 'path'
import * as cst from '../Constants.js';
import * as util from '../Utils.js';

import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

//

const _name     = c.hex(cst.T_COLOR_H_NAME)
const _param    = c.hex(cst.T_COLOR_H_PARAM)
const _opt      = c.gray

const XILO =        c.bold.hex(cst.T_COLOR_TITLE) ("Xilo")
const VERSION =     c.hex(cst.T_COLOR_TITLE)      (JSON.parse(fs.readFileSync(util.getAbsURL(__dirname, '../../../package.json'), 'utf-8')).version);
const HELP_S =      c.hex(cst.T_COLOR_LINK)       ("xilo help")
const INIT =        c.hex(cst.T_COLOR_LINK)       ("xilo init <path>")
const PREFIX =      c.hex(cst.T_COLOR_LINK)       (cst.T_PREFIX_SMALL)

const getUptime = () => process.uptime().toFixed(2) + 's'

//

const SPLASH_MAIN = [
    ``,
    `   ${XILO} ${VERSION}  %uptime%`,
    ``,
    `   ${PREFIX}  Type ${HELP_S} to list out available commands.`,
    `   ${PREFIX}  Or create a default config file with ${INIT}.`,
    ``
];

const SPLASH_HELP = `

${XILO} ${VERSION}  %uptime%

Note: Use --help To display a list of accepted parameters for specific commands.
__________________________________________________________________________________

init   <config>      Creates a template config file in a specified location.
                     Defaults to _./${cst.CNF_FILE_NAME}_
       --force, -f   *Foce the template file.*

run    <config>      Starts the manager using the specified config file.
                     Defaults to _./${cst.CNF_FILE_NAME}_
`

//

export default (disableHelp: boolean) => {

    if (disableHelp === true) {
        console.log(SPLASH_MAIN.join('\n').replace("%uptime%", getUptime()))
    }
    else {

        let formattedText = SPLASH_HELP
            .replace(/\n(?<x>\w+)*/g,                _name("\n$1"))
            .replace(/\<(?<x>[a-zA-z ?]+)*\>/g,      _param("<$1>"))
            .replace(/\*(?<x>[a-zA-z ._<>*/]+)*\*/g, _opt("$1"))
            .replace(/\_(?<x>[a-zA-z ./]+)*\_/g,     c.underline("$1"))
            .replace(/--(?<x>[A-z]+)*/g,             _opt('--$1'))
            .replace(/-(?<x>[A-z]+)*/g,              _opt('-$1'))

        console.log(formattedText.replace("%uptime%", getUptime()))
    }

}
