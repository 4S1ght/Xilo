
// Imports ========================================================================================

import type * as E from './Events'

import cp from 'child_process'
import * as c from '../other/Colors.js'

// Handlers =======================================================================================

// The most events that are compatible anywhere in the application config.
// Other more specific event handlers like exec, restart, kill and etc. live
// In files designated to their specific categories

/**
 * Creates a basic callback-based event handler
 */
export function handle<Event extends E.XiloEvent = E.XiloEvent>(callback: E.EventCallback<Event>): E.EventHandler<Event> {
    return async function(e) {
        try {
            await callback(e)
            return null
        } 
        catch (error) {
            return error as Error
        }
    }
}

// =======================================================================

/**
 * Creates an event handler group. This is useful when a single event, 
 * command or task should perform multiple actions in series.
 */
export function group(callbacks: E.EventHandler[]): E.EventHandler {
    return async function(e) {
        try {
            for (let i = 0; i < callbacks.length; i++) {
                const error = await callbacks[i](e)
                if (error) throw error
            }
            return null
        } 
        catch (error) {
            return error as Error    
        }
    }
}

// =======================================================================

/**
 * "wait" creates a handler that exists specifically to create 
 * time gaps in execution of handler groups.
 */
export function wait(time?: number): E.EventHandler {
    return () => new Promise<null | Error>(end => {
        setTimeout(() => end(null), time)
    })
}

// =======================================================================

interface ExecOptions extends Omit<cp.ExecOptions, "stdio"> {
    /** 
     * Specifies whether or not to display the output of the command. 
     * Defaults to `all`. 
     * */
    stdio?: "all" | "ignore",
    /** Specifies which exit codes should result in a successful run. */
    acceptCodes?: number[]
    /** Whether or not to use basic templating to allow passing parameters from the live terminal. */
    template?: boolean
}

export function exec(command: string, options?: ExecOptions): E.EventHandler {

    const o: ExecOptions = {
        stdio: 'all',
        acceptCodes: [0],
        template: false,
        ...options
    }
  
    if (!command) throw new Error(`exec() - No command specified`)

    // Matches all {X} marks and replaces them with appropriate terminal args
    function injectArgv(e: E.LiveTerminalCommandEvent, string: string): string {
        // Don't do anything in non-terminal events
        if (e.type !== 'terminalEvent' || o.template === false) return string

        // Find all placeholders
        const matches = string.match(/{\d+\}/g)
        if (matches === null) return string

        // Make sure there aren't that the placeholder layout doesn't allow
        // unused command argumnts
        const indexes = matches.map(x => parseInt(x.replace(/{|}/g, ''))).sort()

        for (let i = 1; i < indexes.length; i++) 
            if (indexes[i] - 1 > indexes[i - 1]) 
                throw new SyntaxError(`exec() - Placeholder {${indexes[i]}} allows for unused command parameters.\n`)
        
        if (matches.length > e.terminal.argv.length) throw new Error(`exec() - Not all command parameters were filled.`)

        // Populate the command with passed parameters
        for (let i = 0; i < matches.length; i++) {
            const match = matches[i];
            const index = parseInt(match.replace(/{|}/g, ""))
            string = string.replace(match, e.terminal.argv[index])
        }

        return string
    }

    return (event) => new Promise<null | Error>(async end => {
        try {
            command = injectArgv(event as E.LiveTerminalCommandEvent, command)
            const child = cp.exec(command, { ...o, env: { ...process.env, ...o.env } }) 

            child.stdout?.pipe(process.stdout)
            child.stderr!.on('data', (data) =>  console.log(data.toString()))

            child.on('exit', (code) => {
                if (o.acceptCodes?.includes(code!)) end(null)
                else end(new Error(`exec() - Ended with exit code ${code!}.\nCommand: ${command}`))
            })
        } 
        catch (error) {
            end(error as Error)
        }
    })

}
