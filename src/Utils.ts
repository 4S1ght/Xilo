
import fs from "fs";
import path from "path";
import * as cst from "./Constants.js";
import url from 'url';


/**
 * Creates a URL for programmatically loading modules and files
 */
export const getAbsURL = (...module: string[]) => {
    if (process.platform === 'win32') return url.pathToFileURL(path.join(...module))
    throw new Error('Unsupported platform.')
}


export const chooseConfigPath = (file?: string) => {

    file = file || '';

    let FINAL = ''

    // Make sure the path is absolute and default to CWD if it isn't
    let filePath = path.isAbsolute(file) && process.platform !== 'win32' && ['\\', '/'].includes(file[0])
        ? file
        : path.join(process.cwd(), file);

    // Append the default "xilo.config" file name to the path if it doesn't
    // point to a specific file.
    if ( (!fs.existsSync(filePath) || fs.lstatSync(filePath).isDirectory()) && !cst.CNF_EXT.includes(path.extname(file)) )
        filePath = path.join(filePath, cst.CNF_BASE);


    // Add the .TS extname if not specified
    if (!cst.CNF_EXT.includes(path.extname(filePath)))
        FINAL = `${filePath}${cst.CNF_EXT[1]}`;
    
    // Return the file path if a TS config has been found
    if (fs.existsSync(FINAL)) return FINAL;
    
    return filePath + (path.extname(filePath) === cst.CNF_EXT[0] ? '' : cst.CNF_EXT[0]);
}

/**
 * Creates a time gap in code execution if when used in async functions.
 * Works similarly to `wait` in Bash, but with a specific delay.
 */
export const wait = (time: number) => 
    new Promise(resolve => setTimeout(resolve, time));

/**
 * Checks if the value is an error.
 */
export const isError = (err: unknown): err is Error => 
    err instanceof Error;