
import c from "chalk";
import { LOG_PREFIX } from "../Constants";

export default class Terminal {

    /** Adds padding around a message. */
    private static pad = (content: string) => `\n${content}\n`;
    
    /** Returns a formatted message. */
    public static formatMessage = (prefix: boolean, padding: boolean, ...content: string[]) => {
        const message = `${prefix ? LOG_PREFIX : ''}${content.join(' ')}`;
        return padding ? Terminal.pad(message) : message;
    }

    /** Displays a formatted message. */
    public static message = (prefix = true, padding = true, ...content: string[]) => 
        console.log(Terminal.formatMessage(prefix, padding, ...content))

    /** Returns a formatted error message */
    public static formatError = (prefix = true, padding = true, ...content: string[]) => {
        const message = `${prefix ? LOG_PREFIX : ''}${c.red(content.join(' '))}`;
        return padding ? Terminal.pad(message) : message;
    }

    /** Displays a formatted error message */
    public static error = (prefix = true, padding = true, ...content: string[]) => 
        console.log(Terminal.formatError(prefix, padding, ...content))
    
}