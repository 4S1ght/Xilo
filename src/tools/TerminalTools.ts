

export type CommandHandlerCallback = 
    ((...argv: string[]) => any) |
    ((...argv: string[]) => Promise<any>)

export type ExecutableHandler = (...argv: string[]) => Promise<Error | null>

/**
 * Creates a command handler for the live terminal that is then used to capture user input and perform operations.  
 * Errors thrown from inside command handlers are automatically
 * captured and printed out without crashing the program.  
 * Example:
 * ```js
 * export default {
 *   terminal: {
 *     handlers: {
 *       command_name: createHandler((...argv) => {
 *           console.log(...argv)
 *           // errors thrown here will automatically
 *           // be captured and printed out without crashing
 *       })
 *     }
 *   }  
 * }
 * ```
 */
export function createHandler(callback: CommandHandlerCallback): ExecutableHandler {
    return async (...argv: string[]) => {
        try {
            await callback(...argv)
            return null
        } 
        catch (error) {
            // TODO: Display error message from inside a command handler
            return error as Error
        }
    }
}

/**
 * Groups multiple command handlers together and executes  
 * them all in the exact order they were specified.  
 * Example:
 * ```js
 * export default {
 *   terminal: {
 *     handlers: {
 *       group([
 *         createHandler((...argv) => console.log(`handler #1: ${argv.join(" ")}`)),
 *         createHandler((...argv) => console.log(`handler #2: ${argv.join(" ")}`))
 *       ])
 *     }
 *   }  
 * }
 * ```
 */
export function group(handlers: ExecutableHandler[]): ExecutableHandler {
    return async (...argv: string[]) => {
        for (let i = 0; i < handlers.length; i++) {
            const error = await handlers[i](...argv)
            if (error) return error
        }
        return null
    }
}

/**
 * `wait` is a function that exists specifically to create
 * time delays in groups of command handlers.  
 * Example:
 * ```js
 * export default {
 *   terminal: {
 *     handlers: {
 *       group([
 *         createHandler((...argv) => console.log(`handler #1: ${argv.join(" ")}`)),
 *         wait(1000), // wait 1000 milliseconds
 *         createHandler((...argv) => console.log(`handler #2: ${argv.join(" ")}`))
 *       ])
 *     }
 *   }  
 * }
 * ```
 * 
 */
export function wait(time: number): ExecutableHandler {
    return () => new Promise<null>(end => {
        setTimeout(() => end(null), time);
    })
}



