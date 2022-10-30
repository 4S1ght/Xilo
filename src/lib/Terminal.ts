
import c from "chalk";
import { LOG_PREFIX, CLI_LOG_PREFIX } from "../Constants";

export class Terminal {

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

export class InnerTerminal {

    /** Returns a formatted message. */
    public static formatMessage = (prefix: boolean, ...content: string[]) => {
        return `${prefix ? CLI_LOG_PREFIX : ''}${content.join(' ')}`;
    }
    
    /** Displays a formatted message. */
    public static message = (prefix = true, ...content: string[]) => 
        console.log(InnerTerminal.formatMessage(prefix, ...content))

}