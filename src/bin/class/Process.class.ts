
import EventEmitter from "events";
import cp from 'child_process';
import treeKill from "tree-kill";
import EventProxy from "./EventProxy.class.js";


export default interface Process {
    on(event: 'spawn',          callback: () => any): this
    on(event: 'close',          callback: () => any): this
    on(event: 'kill',           callback: () => any): this
    on(event: 'restart',        callback: () => any): this
    on(event: 'kill-error',     callback: (err: Error) => any): this
    on(event: 'restart-error',  callback: (err: Error) => any): this
}
export default class Process extends EventProxy<'spawn' | 'close' | 'kill' | 'restart' | 'kill-error' | 'restart-error'> {

    declare public child: cp.ChildProcess
    declare public alive: boolean

    public spawnCommand: string;
    public spawnArguments: string[];
    public spawnOptions: cp.SpawnOptions;

    public status: 'awaiting' | 'alive' | 'dead' | 'killed';
    public restarted = false;

    constructor(command: string, argv: string[], options?: cp.SpawnOptions) {

        super()

        this.spawnCommand = command;
        this.spawnArguments = argv;
        this.spawnOptions = options || {};

        this.status = 'awaiting';

    }

    private registerEvents() {

        let self = this;

        this.child.on("spawn", () => {
            self.alive = true;
            self.status = "alive";
            self.emitCustom("spawn");
            // Resume "close" because it might have been paused by kill()
            self.resume("close");
        });
 
        this.child.on('exit', () => {
            self.alive = false;
            if (self.status !== "killed") self.status = "dead";
            // "close" doesn't fire if process was killed manually
            self.emitCustom("close");
            self.pause('close');
        });

        return this;

    }

    public spawn = () => {

        this.child = cp.spawn(this.spawnCommand, this.spawnArguments, {
            stdio: ['ignore', 'inherit', 'inherit'],
            shell: true,
            ...this.spawnOptions
        });
        this.registerEvents();
        return this;

    }

    public kill = (silent = false) => new Promise<void>((resolve, reject) => {
        
        this.pause('close')

        treeKill(this.child.pid!, (error) => {
            if (error) {
                reject(error);
                this.emit('kill-error', error);
                this.resume('close');
            }
            else {
                this.status = 'killed';
                if (!silent) this.emitCustom('kill');
                resolve();
            }
        });

    });

    public restart = () => new Promise<void>((resolve, reject) => {

        this.pause('close');
        this.restarted = true;

        treeKill(this.child.pid!, (error) => {
            if (error) {
                reject(error);
                this.emitCustom('restart-error', error);
                this.resume('close');
            }
            else {
                this.spawn();
                this.registerEvents();
                resolve();
                this.emitCustom('restart');
            }
        })       

    });

    public revive = () => {
        if (this.status === 'alive' || this.status === 'awaiting') return this;
        this.restarted = true;
        this.spawn();
        return this;
    }


}

