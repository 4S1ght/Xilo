
import fs from "fs";
import path from "path";
import c from 'chalk';
import { DEFAULT_CNF_NAME, LOG_PREFIX } from "./Constants";

/**
 * Creates a time gap in code execution if when used in async functions.
 * Works similarly to `wait` in Bash, but with a specific delay.
 */
export const wait = (time: number) => 
    new Promise(resolve => setTimeout(resolve, time));


/**
 * fs.watch can sometimes trigger more than once in specific cases.
 * This class ensures that the first callback fires but all the subsequent ones are blocked.
 */
export class Delay {
    private ready = true;
    private delay: number;
    constructor(delay: number) {
        this.delay = delay;
    }
    public handler(callback: Function): any {
        if (this.ready) {
            this.ready = false;
            callback();
            setTimeout(() => {
                this.ready = true;
            }, this.delay);
        }
    }
}

/**
 * Checks if the value is an error.
 */
export const isError = (err: unknown): err is Error => 
    err instanceof Error;




type File = string
type Found = boolean
/**
 * Checks whether a config file exists in a specified location.
 */ 
export function findConfigFile(file: string): [File, Found] {
    
    let filePath = '';
    
    if      ([undefined, ".", "./"].includes(file)) filePath = path.join(path.join(process.cwd(), DEFAULT_CNF_NAME));
    else if (path.extname(file) === '.js')          filePath = path.isAbsolute(file) ? file : path.join(process.cwd(), file);
    
    return fs.existsSync(filePath) 
        ? [filePath, true] 
        : [filePath, false]
}

export function empty(value: any) {
    return value === undefined ? 'empty string' : value;
}