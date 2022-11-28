
import readline from "readline"
import EventEmitter from "events"
import c from 'chalk'

let i = 0

interface KeyInput { 
    sequence: string
    name:     string
    ctrl:     boolean
    meta:     boolean
    shift:    boolean
}

/** Creates a color palette for submited terminal commands */
function createPalette(...colors: string[]) {
    return {
        stat:       c.hex(colors[0]),
        statBG:     c.bgHex(colors[0]),
        content:    c.hex(colors[1]),
        contentBG:  c.bgHex(colors[1]),
        text:       c.hex(colors[2])
    }
}

const getStdColumns = () => process.stdout.columns - 1

/** Delay between CTRL+C to quit the application. */
const CTRL_C_ACCEPT_DELAY = 300
/** Keys/sequences not accepted by KEY_DEFAULT handler */
const DISABLED_SEQ = ['\r', '\x03']

export interface LiveTerminal {
    on(eventName: string, listener: (args: string[]) => void): this
    on(eventName: 'exit', listener: () => any): this
}
export class LiveTerminal extends EventEmitter {

    constructor() {
        super()
        readline.emitKeypressEvents(process.stdin)
        process.stdin.setRawMode(true)
        this._startInputCapture() 
    }

    private cOK = createPalette(
        "#70CC78",
        "#35863b",
        "#ffffff"
    )
    private cERR = createPalette(
        "#dd5e5e",
        "#9b4a4a",
        "#e9d7d7"
    )
    private cPASS = createPalette(
        "#6297c9",
        "rgb(63, 89, 146)",
        "#c6d3df"
    )

    private _startInputCapture() {
        process.stdin.on('keypress', (string, key: KeyInput) => {

            if      (key.sequence === '\r')         this.KEY_ENTER()
            else if (key.name === 'backspace')      this.KEY_BACKSPACE()
            else if (key.name === 'delete')         this.KEY_DELETE()
            else if (key.name === 'c' && key.ctrl)  this.SEQUENCE_EXIT()

            else if (key.name === 'up')             this.KEY_UP()
            else if (key.name === 'down')           this.KEY_DOWN()
            else if (key.name === 'left')           this.KEY_LEFT()
            else if (key.name === 'right')          this.KEY_RIGHT()

            else                                    this.KEY_DEFAULT(key)

            this._displayCommandString()

        })
    }

    /** 
     * Displays the currently edited command in the bottom-most line of the terminal.
     * 
     * Due to random IO from child processes the string might be duplicated across multiple
     * lines if it's being edited while something is being printed out to the console.
     */
    private _displayCommandString() {

        const text = this._getCurrentCommand()
            .slice(this._xOffset, this._xOffset + getStdColumns())
            .join('')

        const finish = () => readline.cursorTo(process.stdout, this._cursorIndex - this._xOffset, process.stdout.rows)

        readline.cursorTo(process.stdout, 0, process.stdout.rows, () => {
            readline.clearLine(process.stdout, 0, () => {
                if (this._finishedCommand) {
                    console.log(this._finishedCommand + "\n")
                    this._finishedCommand = ''
                }
                else process.stdout.write(text, finish)
            })
        })
    }

    /* Get the currently edited command. */
    private _getCurrentCommand = () => this._history[this._historyIndex]
    /** Get the last command that was used. */
    private _getLastCommand = () => this._history[this._history.length - 1]
    /** Check whether editing a command from history to copy it to the current working array. */
    private _isEditingOldCommand = () => this._historyIndex < this._history.length - 1
    
    /** Command history */
    private _history: string[][] = [[]]
    /** Current position in the history */
    private _historyIndex: number = 0
    /** Current X position of the cursor while editing a command. */
    private _cursorIndex: number = 0
    /** Determines x-axis scrolling offset if a command is longer than total amount of columns. */
    private _xOffset: number = 0
    /** Stores the time of the last exit call to detect double CTRL+C for exitting the app. */
    private _lastExitCall: number = 0
    /** Caches cursor index and offset when navigating between commands in case the used wants to go back to the current one. */
    private _indexAndOffsetCache: [number, number] = [0, 0]
    /** Stores a the finished command to be displayed when the user presses ENTER. */
    private _finishedCommand: string = ''
    /** Determines command execution status - OK, error or passed to a hidden shell. */
    private _commandExecStatus: "cOK" | "cERR" | "cPASS" | undefined

    private _transferFromHistory() {
        const toIndex = this._history.length - 1
        const fromIndex = this._historyIndex
        this._history[toIndex] = [...this._history[fromIndex]]
        this._historyIndex = toIndex
    }
    /** 
     * Removes last command from history if it's the exact same as the previous one. 
     * Useful when pressing the UP key to reuse the same command.
     * This is so repeating the same command doesn't flood the history.
     * (I'm looking at you ZSH...)
     */
    private _removeDuplicatedHistory() {
        try {
            const iLast = this._history.length - 1, iPrev = this._history.length - 2
            if (this._history[iLast].join('') === this._history[iPrev].join(''))
                this._history.pop()
        } 
        catch {}
    }

    /**
     * Sets the proper cursor position and x offset for navifating up/down in history
     */
    private _setIndexAndOffset() {
        if (this._isEditingOldCommand()) {
            const command = this._getCurrentCommand()
            this._cursorIndex = command.length
            const offset = command.length - getStdColumns()
            this._xOffset = Math.max(0, offset)
        }
        else {
            this._cursorIndex = this._indexAndOffsetCache[0]
            this._xOffset     = this._indexAndOffsetCache[1]
        }
    }

    // KEYS
    // =========================================

    /** Handle any non-special keys */
    private KEY_DEFAULT(key: KeyInput) {
        if (this._isEditingOldCommand()) this._transferFromHistory()
        const chars = this._getLastCommand()
        if (!DISABLED_SEQ.includes(key.sequence)) {
            chars.splice(this._cursorIndex, 0, key.sequence)
            this._cursorIndex++
            if (chars.length > getStdColumns()) this._xOffset++
        }
    }

    /** Submits a command. */
    private KEY_ENTER() {
        if (this._isEditingOldCommand()) this._transferFromHistory()

        let string = this._getLastCommand().join('')
        if (string.replace(/ |\t/g, '').length === 0) return
        
        const args = string.split(' ')
        const command = args.shift()

        this.emit(command!, args)

        if (this._getLastCommand().length > 0) {
            this._removeDuplicatedHistory()
            this._history.push([])
            this._historyIndex = this._history.length - 1
        }

        // Reset cursor index and offser
        this._cursorIndex = 0
        this._xOffset = 0

        // Get the finished command ready to be displayed.
        const cp = this[this._commandExecStatus || 'cOK']
        
        if (string.length + 6 > getStdColumns()) {
            string = string.slice(0, getStdColumns() - 7) + '...'
        }

        this._finishedCommand = 
            cp.statBG('  ') + cp.stat(cp.contentBG('\uE0B0')) +
            cp.text(cp.contentBG(` ${string}`)) + cp.content('\uE0B0') + "\x1b[0m"
    }

    /** Removes a character behind the cursor. */
    private KEY_BACKSPACE() {
        if (this._isEditingOldCommand()) this._transferFromHistory()
        const chars = this._getLastCommand()
        if (chars.length > 0 && this._cursorIndex > 0) {
            chars.splice(this._cursorIndex-1, 1)
            this._cursorIndex--
        }
        if (chars.length > 0 && this._xOffset > 0) this._xOffset--
    }

    /** Removes a character in front of the cursor */
    private KEY_DELETE() {
        if (this._isEditingOldCommand()) this._transferFromHistory()
        const chars = this._getLastCommand()
        if (this._cursorIndex < chars.length) {
            chars.splice(this._cursorIndex, 1)
        }
        if (chars.length > 0 && this._xOffset > 0) this._xOffset--
    }

    // CURSOR KEYS
    // =========================================

    /** Goes UP, or "back" in history. */
    private KEY_UP() {
        // Save current commands cursor and offset position before navigating
        if (!this._isEditingOldCommand()) this._indexAndOffsetCache = [ this._cursorIndex, this._xOffset ]
        if (this._historyIndex > 0) this._historyIndex--
        this._setIndexAndOffset()
    }
    
    /** Goes DOWN, or "forward" in history. */
    private KEY_DOWN() {
        if (this._historyIndex < this._history.length - 1) this._historyIndex++
        this._setIndexAndOffset()
    }

    /** Changes the X position of the cursor while typing in the command. */
    private KEY_LEFT() {
        const currentX = this._cursorIndex
        if (currentX > 0) this._cursorIndex--
        else if (this._xOffset > 0) this._xOffset--
    }

    /** Changes the X position of the cursor while typing in the command. */
    private KEY_RIGHT() {
        const currentX = this._cursorIndex
        const command = this._getCurrentCommand()
        if (currentX < command.length) this._cursorIndex++
        if (currentX === getStdColumns() && command.length > currentX + this._xOffset) this._xOffset--
    }

    // KEY SEQUENCES
    // =========================================

    /** Handles the exit sequence */
    private SEQUENCE_EXIT() {
        const now = Date.now()
        if (now - CTRL_C_ACCEPT_DELAY < this._lastExitCall) this.emit('exit')
        this._lastExitCall = now
    }
   
}

export default LiveTerminal