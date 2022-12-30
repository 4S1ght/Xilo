

import EventProxy from "./EventProxy.class.js"
import Process from './Process.class.js'
import * as util from '../other/Utils.js'

import type * as CNF from '../types/config'


export interface ProcessManager {
    on(event: 'spawn',          callback: () => any): this
    on(event: 'close',          callback: () => any): this
    on(event: 'kill',           callback: () => any): this
    on(event: 'restart',        callback: () => any): this
    on(event: 'kill-error',     callback: (err: Error) => any): this
    on(event: 'restart-error',  callback: (err: Error) => any): this
}
export class ProcessManager extends EventProxy<'spawn' | 'close' | 'kill' | 'restart' | 'kill-error' | 'restart-error'> {

    public processes: Record<string, Process> = {}
    public config: CNF.Config

    constructor(config: CNF.Config) {
        super()
        this.config = {...ProcessManager.defaultConfig, ...config}
        ProcessManager.instance = this
    }

    public static instance: ProcessManager
    public static defaultConfig: CNF.Config = {
        processes: {
            timing: 500
        }
    }

    public async createProcesses() {
        
        const itemsType = util.typeOfNested(this.config, 'processes.items')
        const hasItems = itemsType === 'object' && Object.keys(this.config.processes!.items!).length > 0

        // TODO: Use custom error constructor
        if (!['object', 'undefined'].includes(itemsType)) throw new Error("processes.items must be an object")
        // Skip setting up child processes if there aren't any specified
        if (!hasItems) return

        const processNames = Object.keys(this.config.processes!.items!)
        
        for (let i = 0; i < processNames.length; i++) {

            const name = processNames[i]
            const configCreator = this.config.processes!.items![name]

            // Allow process config to exist in object form and to also be a function
            // returning the configuration to enable debugging
            const processConfig = typeof configCreator === 'function' ? configCreator() : configCreator;
            const [command, ...argv] = processConfig.command.split(' ')
            
            this.processes[name] = new Process(name, command, argv, processConfig)

        }

    }

    public async startEach(callback?: (process: Process) => any) {

        const spawnDelay = util.typeOfNested(this.config, 'processes.timing') === 'number'
            ? this.config.processes!.timing
            : 500

        const spawnProcess = (name: string) => new Promise<Process>((resolve) => {
            if (callback) callback(this.processes[name])
            this.processes[name].on('spawn', () => {
                this.emitCustom('spawn', name)
                resolve(this.processes[name])
            })
            this.processes[name].spawn()
        })

        for (const process in this.processes) {
            await spawnProcess(process)
            await util.wait(spawnDelay)
        }
        
    }

}

export default function createProcessManager(config: CNF.Config) {
    return ProcessManager.instance || new ProcessManager(config)
}