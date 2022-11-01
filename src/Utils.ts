
import fs from "fs";
import path from "path";
import * as cst from "./Constants.js";
import url from 'url';


export const getAbsURL = (...module: string[]) => {
    if (process.platform === 'win32') return url.pathToFileURL(path.join(...module))
    throw new Error('Unsupported platform.')
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