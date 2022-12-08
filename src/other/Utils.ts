
import fs from "fs"
import path from "path"
import * as cst from "./Constants.js"
import url from 'url'



/**
 * Creates a URL for programmatically loading modules and files
 */
export const getAbsURL = (...module: string[]) => {
    return url.pathToFileURL(path.join(...module))
}



export const chooseConfigCreationPath = (file?: string) => {

    file = file || ''

    let FINAL = ''

    // Make sure the path is absolute and default to CWD if it isn't
    let filePath = path.isAbsolute(file) && process.platform !== 'win32' && ['\\', '/'].includes(file[0])
        ? file
        : path.join(process.cwd(), file)

    // Append the default "xilo.config.js" file name to the path if it doesn't
    // point to a specific file.
    if ( (!fs.existsSync(filePath) || fs.lstatSync(filePath).isDirectory()) && path.extname(file) !== ".mjs" )
        filePath = path.join(filePath, cst.CNF_FILE_NAME)
    
    // Return the file path if a TS config has been found
    if (fs.existsSync(FINAL)) return FINAL
    
    return filePath
}



export const getConfigPath = (file?: string): [string, boolean] => {

    file = file || ''

    // Make sure the path is absolute and default to CWD if it isn't
    let filePath = path.isAbsolute(file) && process.platform !== 'win32' && ['\\', '/'].includes(file[0])
        ? file
        : path.join(process.cwd(), file)
        
    if (path.extname(filePath) === '.mjs')
        return [filePath, fs.existsSync(filePath)]

    if (!path.extname(filePath)) {
        const JS = path.join(filePath, cst.CNF_FILE_NAME)
        if (fs.existsSync(JS)) return [JS, true]
    }
    
    return [filePath, fs.existsSync(filePath) && path.extname(filePath) === '.mjs']

}



/**
 * Creates a time gap in code execution if when used in async functions.
 * Works similarly to `wait` in Bash, but with a specific delay.
 */
export const wait = (time: number) => 
    new Promise(resolve => setTimeout(resolve, time))



/**
 * Checks if the value is an error.
 */
export const isError = (err: unknown): err is Error => 
    err instanceof Error



/**
 * fs.watch can sometimes trigger more than once in specific cases.
 * This class ensures that the first callback fires but all the subsequent ones are blocked.
 */
export class Delay {

    private ready = true
    private delay: number
    private declare timeout: NodeJS.Timeout

    constructor(delay: number) {
        this.delay = delay
    }

    public run(callback: Function): void {
        if (this.ready) callback()
        this.ready = false
        clearTimeout(this.timeout)
        setTimeout(() => this.ready = true, this.delay);
    }

}