
import c from 'chalk';
import fs from 'fs';
import path from 'path'
import * as cst from '../Constants';

//

const XILO =        c.bold.hex(cst.T_COLOR_TITLE) ("Xilo")
const VERSION =     c.hex(cst.T_COLOR_TITLE)      (JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf-8')).version);
const HELP =        c.hex(cst.T_COLOR_LINK)       ("xilo help")
const INIT =        c.hex(cst.T_COLOR_LINK)       ("xilo init <path>")
const PREFIX =      c.hex(cst.T_COLOR_LINK)       (cst.T_PREFIX_SMALL)

const UPTIME =      process.uptime().toFixed(2) + 's'

//

const splash = [
    ``,
    `   ${XILO} ${VERSION}  ${UPTIME}`,
    ``,
    `   ${PREFIX}  Type ${HELP} to list out available commands.`,
    `   ${PREFIX}  Or create a default config file with ${INIT}.`,
    ``
];

const help = `
`

//

export default (disableHelp: boolean) => {

    console.log(c.grey(splash.join('\n')))

    if (disableHelp !== true) {
        console.log(help)
    }
}
