
import * as c from '../other/Colors.js'

import createManager from '../class/ProrcessManager.class.js'
import LiveTerminal from '../class/LiveTerminal.class.js'

import type { ProcessManager } from '../class/ProrcessManager.class.js'
import type * as CNF from "../types/config.js"
import Terminal from '../other/Terminal.js'


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
            Terminal.INFO(`Starting "${process.name}"`)
        })
        this.terminal.start()
        
    }

    private setProcessEventMessages(): void {
        for (const name in this.manager.processes) {
            const process = this.manager.processes[name]
            process.on('close',         () =>           Terminal.EXIT (`Process "${process.name}" closed with code "${process.child.exitCode}".`))
            process.on('kill',          () =>           Terminal.EXIT (`Killed process "${process.name}".`))
            process.on('kill-error',    (err: Error) => Terminal.ERROR(`An error had accurd while attempting to kill "${process.name}".`, err))
            process.on('restart',       () =>           Terminal.WARN (`Restarted process "${process.name}".`))
            process.on('restart-error', (err: Error) => Terminal.ERROR(`An error had accured while attemptting to restart "${process.name}".`, err))
            process.on('spawn',         () =>           Terminal.INFO(`Process "${process.name}" is running.`))
        }
    }

    private setLiveTerminalCommands(): void {

        const terminal = this.terminal
        const manager = this.manager
        const config = this.config

        /**
         * Exit the application.
         */
        terminal.on('exit', async () => {
            for (const name in manager.processes) {
                if (manager.processes[name].child.exitCode === null)
                    await manager.processes[name].kill()
            }
            process.exit()
        })

        // TODO: throw and stop initialisation if a command contains illegal chars
        /** 
         * Register user-defined command callbacks.
         */
        if (config.terminal && config.terminal.handlers) {

            const commands = Object.keys(config.terminal.handlers)

            commands.forEach(command => {
                // Prohibit whitespaces in command names
                if (command.includes(' ')) {
                    throw new SyntaxError(`Command name can not contain whitespaces. Got "${command}".`)
                }

                const handler = config.terminal!.handlers![command]

                terminal.on(command, async (...argv) => {
                    try {
                        const error = await handler(...argv)
                        if (error) throw error
                    } 
                    catch (error) {
                        console.log(error)
                    }
                })

            })
        }

    }


}

