

// Types ========================================================================================

// Events

namespace Fields {
    export interface Terminal {
        argvRaw: string
        argv: string[]
    }
}

export interface XiloEventFields {
    type: EventType
    terminal: Fields.Terminal
}

// Handlers

/** A callback function passed to event handler creators. */
export type EventCallback<E extends XiloEvent = XiloEvent> = (e: E) => Promise<any> | any 
/** A function returned when creating a new handler, safely returns an Error, null if successful */
export type EventHandler<E extends XiloEvent = XiloEvent> = (E: E) => Promise<Error | null>
/** Event types */
export type EventType = "baseEvent" | "terminalEvent" | "task"

// Classes ======================================================================================

export class XiloEvent implements XiloEventFields {

    /** The event type specifies from where the event had originated. Like the rerminal, fs, timer, etc.*/
    public type: EventType = "baseEvent"

    /** Contains parameters used for command handling in the live terminal.*/
    public terminal: Fields.Terminal = {
        argvRaw: "",
        argv: []
    }

}

export class LiveTerminalCommandEvent extends XiloEvent {

    public type: "terminalEvent" = "terminalEvent"

    constructor(argv: string[]) {
        super()
        this.terminal.argvRaw = argv.join(" ")
        this.terminal.argv = argv
    }

}

export class StartupTaskEvent extends XiloEvent {

    public type: "task" = "task"

    constructor(public ignoreErrors: boolean) {
        super()
    }

}