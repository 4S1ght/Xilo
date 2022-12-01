
import c from "chalk"
import * as cst from "./Constants.js"

export class Terminal {

    /** Adds padding around a message. */
    private static pad = (content: string) => `\n${content}\n`
    
    /** Returns a formatted message. */
    public static formatMessage = (prefix: boolean, padding: boolean, ...content: string[]) => {
        const message = `${prefix ? cst.T_PREFIX_BIG : ''} ${content.join(' ')}`
        return padding ? Terminal.pad(message) : message
    }

    /** Displays a formatted message. */
    public static message = (prefix = true, padding = true, ...content: string[]) => 
        console.log(Terminal.formatMessage(prefix, padding, ...content))

    /** Returns a formatted error message */
    public static formatError = (prefix = true, padding = true, ...content: string[]) => {
        const message = `${prefix ? cst.T_PREFIX_BIG : ''} ${c.red(content.join(' '))}`
        return padding ? Terminal.pad(message) : message
    }

    /** Displays a formatted error message */
    public static error = (prefix = true, padding = true, ...content: string[]) => 
        console.log(Terminal.formatError(prefix, padding, ...content))
    
}