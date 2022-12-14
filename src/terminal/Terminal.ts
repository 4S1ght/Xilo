
import * as c from "../other/Colors.js"
import * as cst from "../other/Constants.js"

export default class Terminal {

    // Basic
    /** Shows an info message */
    public static INFO  = (...msg: string[]) => console.log(`${c.blue('INFO')} ${msg.join(' ')}`)
    /** Shows a warning */
    public static WARN  = (...msg: string[]) => console.log(`${c.yellowBG(' WARN ')} ${c.yellow(msg.join(' '))}`)
    /** Shows an error (last parameter is treated as an error) */
    public static ERROR = (...msg: (string|Error)[]) => {
        const error = msg[msg.length - 1] instanceof Error ? msg.pop() as Error : null;
        console.log(`${c.redBG(' ERROR ')} ${c.red(msg.join(' '))}`)
        if (error) console.log(error)
    }

    /** Displays an exit message for processes and tasks */
    public static EXIT  = (...msg: string[]) => console.log(`${c.redBG(' EXIT ')} ${c.red(msg.join(' '))}`)

    /** Adds padding around a message. */
    private static pad = (content: string) => `\n${content}\n`
    
    /** Returns a formatted message. */
    public static formatStaticMessage = (prefix: boolean, padding: boolean, ...content: string[]) => {
        const message = `${prefix ? cst.T_PREFIX_BIG : ''} ${content.join(' ')}`
        return padding ? Terminal.pad(message) : message
    }

    /** Displays a formatted message. */
    public static staticMessage = (prefix = true, padding = true, ...content: string[]) => 
        console.log(Terminal.formatStaticMessage(prefix, padding, ...content))

    /** Returns a formatted error message */
    public static formatStaticError = (prefix = true, padding = true, ...content: string[]) => {
        const message = `${prefix ? cst.T_PREFIX_BIG : ''} ${c.red(content.join(' '))}`
        return padding ? Terminal.pad(message) : message
    }

    /** Displays a formatted error message */
    public static staticError = (prefix = true, padding = true, ...content: string[]) => 
        console.log(Terminal.formatStaticError(prefix, padding, ...content))
    
}