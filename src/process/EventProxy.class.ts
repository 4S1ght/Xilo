
import EventEmitter from "events"

/**
 * EventProxy is a class built on top of EventEmitter that adds pause/resume functionality.
 * This is useful in cases where a child process was killed manually from the CLI
 * but there's no intention to trigger an event indicating its unexpected death.
 */
export default class EventProxy<Event extends string = any> extends EventEmitter {

    public pausedEvts: Record<string, boolean> = {}

    constructor() {
        super()
    }

    /** 
     * Synchronously calls each of the listeners registered for the event if it's not paused. 
     */
    public emitCustom(event: Event, ...args: any[]) {
        if (this.pausedEvts[event]) return this
        this.emit(event, args)
        return this
    }

    /** 
     * Blocks the proxy from emitting a specific event. 
     */
    public pause(event: Event) {
        this.pausedEvts[event] = true
        return this
    }

    /** 
     * Resumes emitting of an event previously blocked by `Proxy.pause()` 
     */
    public resume(event: Event) {
        this.pausedEvts[event] = false
        return this
    }

}