

import EventProxy from "./EventProxy.class";
import Process from './Process.class';

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
    public static defaultConfig = {}

    public createProcess(name: string, p: CNF.ProcessConfig): Process {

        if (!p.command) throw new Error('ProcessManager.createProcess Error - Unknown spawn command.')
        let params = p.command.split(' ');
        let process = new Process(params.shift()!, params, p);
        this.processes[name] = process;
        return process;
    }

}

export function createProcessManager(config: CNF.Config) {
    return ProcessManager.instance || new ProcessManager(config);
}