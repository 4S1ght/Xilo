
import type { ProcessManager } from '../process/ProrcessManager.class.js'
import type * as CNF from "../types/config.js"

import createManager from '../process/ProrcessManager.class.js'
import LiveTerminal from '../terminal/LiveTerminal.class.js'

import Terminal from '../terminal/Terminal.js'
import * as Events from '../events/Events.js'
import * as c from '../other/Colors.js'
import * as util from '../other/Utils.js'
import * as consts from '../other/Constants.js'


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

        await this.runStartupTasks()
        await m.startEach((process) => Terminal.INFO(`Starting "${process.name}"`))

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
            process.on('spawn',         () =>           Terminal.INFO (`Process "${process.name}" is running.`, c.grey(`[pid ${process.child.pid}]`)))
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
            process.exit(consts.EXIT_CODES.USER_FORCED)
        })

        // TODO: throw and stop initialisation if a command contains illegal chars
        // Register user-defined command callbacks.
        if (config.terminal && config.terminal.handlers) {

            const commands = Object.keys(config.terminal.handlers)

            commands.forEach(command => {
                // Prohibit whitespaces in command names
                // TODO: Use a custom error constructor for command syntax errors
                if (command.includes(' ')) {
                    throw new SyntaxError(`Command name can not contain whitespaces. Got "${command}".`)
                }

                const handler = config.terminal!.handlers![command]

                terminal.on(command.toLocaleLowerCase(), async (...argv) => {
                    try {
                        const event = new Events.LiveTerminalCommandEvent(argv)
                        const error = await handler(event)
                        if (error) throw error
                    } 
                    catch (error) {
                        console.log(error)
                    }
                })

            })
        }

    }

    private async runStartupTasks(): Promise<void> {
        
        const itemsType  = util.typeOfNested(this.config, 'tasks.items')
        const hasItems   = ['object', 'array'].includes(itemsType) && this.config.tasks!.items!.length > 0
        
        const spawnDelay = util.typeOfNested(this.config, 'tasks.timing') === 'number' ? this.config.tasks!.timing : 500
        const ignoreErrors = util.typeOfNested(this.config, 'tasks.ignoreErrors') === 'boolean' ? this.config.tasks!.ignoreErrors! : false

        // Skip if there are no tasks specified
        if (!hasItems) return

        const tasks = this.config.tasks!.items!

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i]
            const event = new Events.StartupTaskEvent(ignoreErrors)
            const error = await task(event)
            
            if (error) Terminal.ERROR(`An error had accured in task #${i+1}.`, error as Error)
            if (error && !ignoreErrors) process.exit(consts.EXIT_CODES.TASK_ERROR)
        }


    }

}

