
import c from 'chalk';

import createManager from '../class/ProrcessManager.class.js'
import LivePrompt from '../LiveTerminal.js'

import type Process from '../../bin/class/Process.class'
import type { ProcessManager } from '../class/ProrcessManager.class.js'
import type * as CNF from "../../../types/config";



export default async function main(config: CNF.Config) {

    // console.log(config)

    // Startup

    // Process manager
    const m = createManager(config)
    await m.createProcesses()

    for (const name in m.processes)
        setProcessEventMessages(m.processes[name])
    
    await m.startEach((process) => {
        console.log(c.green(`Spawning "${process.name}"`))
    })

    // Live prompt
    const p = new LivePrompt();
    setPromptCommandHandlers(p, m);

}

function setProcessEventMessages(process: Process) {

    const close      = () =>           console.log(c.red(`Process "${process.name}" closed with code "${process.child.exitCode}".`))
    const kill       = () =>           console.log(c.red(`Killed process "${process.name}".`))
    const killErr    = (err: Error) => console.log(c.red(`An error accurd while attempting to kill "${process.name}".`), err)
    const restart    = () =>           console.log(c.yellow(`Restarted process "${process.name}".`))
    const restartErr = (err: Error) => console.log(c.red(`An error accured while attemptting to restart "${process.name}".`), err)
    const spawn      = () =>           console.log(c.green(`Process "${process.name}" running.`))
    
    process.on('close',         close)
    process.on('kill',          kill)
    process.on('kill-error',    killErr)
    process.on('restart',       restart)
    process.on('restart-error', restartErr)
    process.on('spawn',         spawn)
    
}

function setPromptCommandHandlers(prompt: LivePrompt, manager: ProcessManager) {

    // prompt.on('exit', async () => {
    //     for (const name in manager.processes) {
    //         await manager.processes[name].kill()
    //     }
    //     process.exit();
    // })

    // prompt.on('command', (argv: string[]) => {
    //     const argv
    // })
}
