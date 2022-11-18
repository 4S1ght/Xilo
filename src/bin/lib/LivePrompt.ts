
import readline from "readline";
import EventEmitter from "events";

interface KeyInput { 
    sequence: string
    name:     string
    ctrl:     boolean
    meta:     boolean
    shift:    boolean
}

const MAX_CHARS =               70;
const CTRL_C_ACCEPT_DELAY =     300;
const DISABLED_SEQ =            ['\r', '\x03'];

export interface Prompt {
    on(eventName: 'exit', listener: () => any): this
    on(eventName: 'command', listener: (args: string[]) => void): this
}

export class Prompt extends EventEmitter {

    private _history: string[][] = [[]];
    private _historyIndex = 0;
    private _commandIndex = 0;

    private _acceptInput = true;
    private _lastExitCall = 0;

    // private line = readline.createInterface({
    //     input: process.stdin
    // })

    constructor() {
        super();
        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);
        this._captureInput()
    }

    /** Toggles text input in the CLI. */
    public enableInput(value: boolean) {
        this._acceptInput = value;
        return this;
    }

    /** Capture user input and forward the key press to a dedicated function. */
    private _captureInput() {
        process.stdin.on('keypress', (string, key: KeyInput) => {
            if (this._acceptInput) {

                if      (key.sequence === '\r')         this._keyEnter();
                else if (key.name === 'backspace')      this._keyBackspace();
                else if (key.name === 'delete')         this._keyDelete();
                else if (key.name === 'c' && key.ctrl)  this._sequenceExit();

                else if (key.name === 'up')             this._arrowUp();
                else if (key.name === 'down')           this._arrowDown();
                else if (key.name === 'left')           this._arrowLeft();
                else if (key.name === 'right')          this._arrowRight();

                else                                    this._keyDefault(key);

                /** Rerender stored input */
                this._displayCommandString(this._getCurrentCommand().join(''));
                
            }
        });
    }

    private _displayCommandString(text?: string) {
        readline.cursorTo(process.stdout, 0, process.stdout.rows, () => {
            readline.clearLine(process.stdout, 0, () => {
                process.stdout.write(text || '');
            });
        });
    }

    private _getCurrentCommand = () => this._history[this._historyIndex];
    private _getLastCommand = () => this._history[this._history.length - 1];

    private _isEditingOldCommand = () => this._historyIndex < this._history.length - 1;
    private _transferFromHistory() {
        const toIndex = this._history.length - 1;
        const fromIndex = this._historyIndex;
        this._history[toIndex] = [...this._history[fromIndex]];
        this._historyIndex = toIndex;
    }

    private _removeDuplicatedCommand() {
        try {
            const iLast = this._history.length - 1, iPrev = this._history.length - 2;
            if (this._history[iLast].join('') === this._history[iPrev].join(''))
                this._history.pop();
        } 
        catch{}
    }

    // ===============================================

    /** Appends a character to _tempChars. */
    private _keyDefault(key: KeyInput) {
        if (this._isEditingOldCommand()) this._transferFromHistory();
        const cmd = this._getLastCommand();
        if (cmd.length < MAX_CHARS && !DISABLED_SEQ.includes(key.sequence)) cmd.push(key.sequence);    
    }

    /** Removes the last key from _tempChars. */
    private _keyBackspace() { 
        if (this._commandIndex > 0) {
            if (this._isEditingOldCommand()) this._transferFromHistory();
            this._getLastCommand().splice(this._commandIndex, 1);
            this._commandIndex--;
        }
    }
    private _keyDelete() { 
        if (this._getCurrentCommand().length - this._commandIndex >= 0) {
            if (this._getLastCommand()) this._transferFromHistory();
            this._getCurrentCommand().splice(this._commandIndex + 1, 1);
        }
    }

    private _keyEnter() {
        if (this._isEditingOldCommand()) this._transferFromHistory();

        const args = this._getLastCommand().join('').split(' ');
        this.emit('command', args);

        if (this._getLastCommand().length > 0) {
            this._removeDuplicatedCommand();
            this._history.push([]);
            this._historyIndex = this._history.length - 1;
        }
        // console.log(this._history)
    }

    private _sequenceExit() {
        const now = Date.now();
        if (now - CTRL_C_ACCEPT_DELAY < this._lastExitCall) this.emit('exit');
        this._lastExitCall = now;
    }

    // ===============================================

    private _arrowLeft() {
        if (this._commandIndex > 0) this._commandIndex--;
    }
    private _arrowRight() {
        if (this._commandIndex < this._getCurrentCommand().length) this._commandIndex++;
    }
    private _arrowUp() {
        if (this._historyIndex > 0) {
            this._historyIndex--;
            this._commandIndex = this._getCurrentCommand().length - 1;
        }
    }
    private _arrowDown() {
        if (this._historyIndex < this._history.length-1) {
            this._historyIndex++;
            this._commandIndex = this._getCurrentCommand().length - 1;
        }
    }
}

export default Prompt;

// new Prompt();

