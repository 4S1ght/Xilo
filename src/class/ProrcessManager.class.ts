

import EventProxy from "./EventProxy.class";
import Process from './Process.class';
import * as util from '../Utils';

import type * as CNF from '../../types/config';



interface ProcessManager {
    on(event: 'spawn',          callback: () => any): this
    on(event: 'close',          callback: () => any): this
    on(event: 'kill',           callback: () => any): this
    on(event: 'restart',        callback: () => any): this
    on(event: 'kill-error',     callback: (err: Error) => any): this
    on(event: 'restart-error',  callback: (err: Error) => any): this
}
class ProcessManager extends EventProxy<'spawn' | 'close' | 'kill' | 'restart' | 'kill-error' | 'restart-error'> {

    public processes: Record<string, Process> = {}
    public config: CNF.Config;

    constructor(config: CNF.Config) {
        super();
        this.config = {...ProcessManager.defaultConfig, ...config};
        ProcessManager.instance = this;
    }

    public static instance: ProcessManager
    public static defaultConfig: CNF.Config = {}

    public createProcess(name: string, p: CNF.ProcessConfig): Process {

        if (!p.command) throw new Error('ProcessManager.createProcess Error - Unknown spawn command.')
        let params = p.command.split(' ');
        let process = new Process(params.shift()!, params, p);
        this.processes[name] = process;
        return process;

    }

    public async createProcesses() {
        
        const processNames = Object.keys(this.config.processes!);
        
        for (let i = 0; i < processNames.length; i++) {
            const [processName, ...argv] = processNames[i].split(" ");
            const processConfig = this.config.processes![processName];
            this.processes[processName] = new Process(processName, argv, processConfig)
        }

    }

    public async startEach(callback: (process: Process) => any) {

        const spawnProcess = (name: string) => new Promise<Process>((resolve) => {
            this.processes[name].on('spawn', () => {
                this.emitCustom('spawn', name);
                resolve(this.processes[name]);
            });
            this.processes[name].spawn();
        })

        for (const process in this.processes) {
            const instance = await spawnProcess(process);
            callback(instance)
            await util.wait((this.config.settings || {} as any).scriptSpawnDelay || 500);
        }
        
    }

}

export function createProcessManager(config: CNF.Config) {
    return ProcessManager.instance || new ProcessManager(config);
}