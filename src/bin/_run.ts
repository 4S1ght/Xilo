
import path from "path";
import fs from "fs";
import c from 'chalk';
import { findConfigFile } from "../Utils";
import Terminal from "../lib/Terminal";

export default (argv: string[]) => {

    const [_, found] = findConfigFile(argv[0]);
    const filePath = argv[0] || "no path";

    if (argv[0] && argv[0].indexOf('-') === 0) return Terminal.error(true, true, c.red(`Error: <file> in "xilo run <file>" can not be an option. Redieved "${argv[0]}".`));
    if (!found)                                return Terminal.error(true, true, c.red(`Error: Could not locate the config file - ${filePath}`));

}