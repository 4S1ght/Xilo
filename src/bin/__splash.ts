
import c from 'chalk';
import fs from 'fs';
import path from 'path'
import { CLI_LOG_PREFIX } from '../Constants';

// ==========================

const XILO =    c.bold.hex("#ffa139")("Xilo")
const VERSION =      c.hex("#ffa139")(JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf-8')).version);
const HELP =         c.hex("#ffcf65")("xilo help")
const INIT =         c.hex("#ffcf65")("xilo init <path>")
const PREFIX =       c.hex("#ffcf65")(CLI_LOG_PREFIX)

const splash = c.grey(`
    ${XILO} ${VERSION}

    ${PREFIX}  Type ${HELP} to list out available commands. 
    ${PREFIX}  Or create a default config file with ${INIT}.
`)

// ==========================

export default () => console.log(splash);

setInterval(() => {}, 1000)