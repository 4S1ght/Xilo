

// Types ========================================================================================

// Events

namespace Fields {
    export interface Terminal {
        argvRaw: string
        argv: string[]
    }
}

export interface XiloEventFields {
    terminal: Fields.Terminal
}

// Handlers

/** A callback function passed to event handler creators. */
export type EventCallback<E extends XiloEvent = XiloEvent> = (e: E) => Promise<any> | any 
/** A function returned when creating a new handler, safely returns an Error, null if successful */
export type EventHandler<E extends XiloEvent = XiloEvent> = (E: E) => Promise<Error | null>
/** */

// Classes ======================================================================================

class XiloEvent implements XiloEventFields {
    /**
     * Contains parameters used for command handling
     * in the live terminal.
     */
    public terminal: Fields.Terminal = {
        argvRaw: "",
        argv: []
    }

}

export class LiveTerminalCommandEvent extends XiloEvent {
    constructor(argv: string[]) {
        super()
        this.terminal.argvRaw = argv.join(" ")
        this.terminal.argv = argv
    }
}

// Methods ======================================================================================

// The most events that are compatible anywhere in the application config.
// Other more specific event handlers like exec, restart, kill and etc. live
// In files designated to their specific categories

/**
 * Creates a basic callback-based event handler
 */
export function handle<E extends XiloEvent = XiloEvent>(callback: EventCallback<E>): EventHandler<E> {
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

/**
 * Creates an event handler group.  
 * This is useful when a single event, command or task should perform multiple actions in series.
 */
export function group(callbacks: EventCallback<XiloEvent>[]): EventHandler<XiloEvent> {
    return async function(e) {
        try {
            for (let i = 0; i < callbacks.length; i++) await callbacks[i](e)
            return null
        } 
        catch (error) {
            return error as Error    
        }
    }
}

/**
 * "wait" creates a handler that exists specifically to create 
 * time gaps in execution of handler groups.
 */
export function wait(time?: number): EventHandler<XiloEvent> {
    return () => new Promise<null>(end => {
        setTimeout(() => end(null), time);
    })
}
