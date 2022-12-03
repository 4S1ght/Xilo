
import * as c from '../../colors.js'

import createManager from '../class/ProrcessManager.class.js'
import LiveTerminal from '../class/LiveTerminal.class.js'

import type Process from '../class/Process.class'
import type { ProcessManager } from '../class/ProrcessManager.class.js'
import type * as CNF from "../../../types/config"


export default class Program {

    private config: CNF.Config
    private manager: ProcessManager
    private terminal: LiveTerminal

    constructor(config: CNF.Config) {
        this.config   = config
        this.manager  = createManager(config)
        this.terminal = new LiveTerminal(config.terminal || {})
    }

    public async start() {

        const m = this.manager
        await m.createProcesses()

        this.setProcessEventMessages()
        this.setLiveTerminalCommands()
            
        await m.startEach((process) => {
            console.log(c.green(`Starting "${process.name}"`))
        })

        this.terminal.start()

    }

    private setProcessEventMessages(): void {
        for (const name in this.manager.processes) {
            const process = this.manager.processes[name]
            process.on('close',         () =>           console.log(c.red(`Process "${process.name}" closed with code "${process.child.exitCode}".`)))
            process.on('kill',          () =>           console.log(c.red(`Killed process "${process.name}".`)))
            process.on('kill-error',    (err: Error) => console.log(c.red(`An error accurd while attempting to kill "${process.name}".`), err))
            process.on('restart',       () =>           console.log(c.yellow(`Restarted process "${process.name}".`)))
            process.on('restart-error', (err: Error) => console.log(c.red(`An error accured while attemptting to restart "${process.name}".`), err))
            process.on('spawn',         () =>           console.log(c.green(`Process "${process.name}" is running.`)))
        }

    }

    private setLiveTerminalCommands(): void {

        const terminal = this.terminal
        const manager = this.manager

        /**
         * Exit the application.
         */
        terminal.on('exit', async () => {
            for (const name in manager.processes) {
                await manager.processes[name].kill()
            }
            process.exit()
        })

    }

}
