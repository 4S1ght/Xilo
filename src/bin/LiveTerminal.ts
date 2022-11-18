
import readline from "readline"
import EventEmitter from "events"

interface KeyInput { 
    sequence: string
    name:     string
    ctrl:     boolean
    meta:     boolean
    shift:    boolean
}

/** 
 * Max chars in one command 
 * ! IMPORTANT: will change to process.stdout.columnsdue to bugs while char count exceeds the numbert of columns
 */
const MAX_CHARS = 70
/** Delay between CTRL+C to quit the application. */
const CTRL_C_ACCEPT_DELAY = 300
/** Keys/sequences not accepted by KEY_DEFAULT handler */
const DISABLED_SEQ = ['\r', '\x03']

export interface Prompt {
    on(eventName: 'exit', listener: () => any): this
    on(eventName: 'command', listener: (args: string[]) => void): this
}
export class Prompt extends EventEmitter {

    constructor() {
        super()
        readline.emitKeypressEvents(process.stdin)
        process.stdin.setRawMode(true)
        this._startInputCapture()
    }

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

            this._displayCommandString(this._getCurrentCommand().join(''))

        })
    }

    /** 
     * Displays the currently edited command in the bottom-most line of the terminal.
     * 
     * Due to random IO from child processes the string might be duplicated across multiple
     * lines if it's being edited while something is being printed out to the console.
     */
    private _displayCommandString(text?: string) {
        readline.cursorTo(process.stdout, 0, process.stdout.rows, () => {
            readline.clearLine(process.stdout, 0, () => {
                process.stdout.write(text || '');
            });
        });
    }

    /* Get the currently edited command. */
    private _getCurrentCommand = () => this._history[this._historyIndex];
    /** Get the last command that was used. */
    private _getLastCommand = () => this._history[this._history.length - 1];
    /** Check whether editing a command from history to copy it to the current working array. */
    private _isEditingOldCommand = () => this._historyIndex < this._history.length - 1;
    
    /** Command history */
    private _history: string[][] = [[]]
    /** Current position in the history */
    private _historyIndex: number = 0
    /** Current X position of the cursor while editing a command. */
    private _cursorIndex = 0;
    /** Stores the time of the last exit call to detect double CTRL+C for exitting the app. */
    private _lastExitCall = 0;

    private _transferFromHistory() {
        const toIndex = this._history.length - 1;
        const fromIndex = this._historyIndex;
        this._history[toIndex] = [...this._history[fromIndex]];
        this._historyIndex = toIndex;
    }
    /** 
     * Removes last command from history if it's the exact same as the previous one. 
     * Useful when pressing the UP key to reuse the same command.
     * This is so repeating the same command doesn't flood the history.
     * (I'm looking at you ZSH...)
     */
    private _removeDuplicatedHistory() {
        try {
            const iLast = this._history.length - 1, iPrev = this._history.length - 2;
            if (this._history[iLast].join('') === this._history[iPrev].join(''))
                this._history.pop();
        } 
        catch {}
    }

    // KEYS
    // =========================================

    /** Handle any non-special keys */
    private KEY_DEFAULT(key: KeyInput) {
        if (this._isEditingOldCommand()) this._transferFromHistory();
        const chars = this._getLastCommand();
        if (chars.length < MAX_CHARS && !DISABLED_SEQ.includes(key.sequence)) chars.push(key.sequence);   
    }
    /** Submits a command. */
    private KEY_ENTER() {
        if (this._isEditingOldCommand()) this._transferFromHistory()

        const args = this._getLastCommand().join('').split(' ');
        this.emit('command', args);

        if (this._getLastCommand().length > 0) {
            this._removeDuplicatedHistory();
            this._history.push([]);
            this._historyIndex = this._history.length - 1;
        }

        console.log(this._history)
    }
    /** Removes a character behind the cursor. */
    private KEY_BACKSPACE() {

    }
    /** Removes a character in front of the cursor */
    private KEY_DELETE() {

    }

    // CURSOR KEYS
    // =========================================

    /** Goes UP, or "back" in history. */
    private KEY_UP() {

    }
    /** Goes DOWN, or "forward" in history. */
    private KEY_DOWN() {

    }
    /** Changes the X position of the cursor while typing in the command. */
    private KEY_LEFT() {

    }
    /** Changes the X position of the cursor while typing in the command. */
    private KEY_RIGHT() {
        
    }

    // KEY SEQUENCES
    // =========================================

    /** Handles the exit sequence */
    private SEQUENCE_EXIT() {
        const now = Date.now();
        if (now - CTRL_C_ACCEPT_DELAY < this._lastExitCall) this.emit('exit');
        this._lastExitCall = now;
    }
   
}

export default Prompt

const testTerminal = new Prompt()
testTerminal.on('exit', process.exit)
