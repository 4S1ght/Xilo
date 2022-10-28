

import type cp from "child_process"

export interface Config {

    /** 
     * Specifies miscellaneous settings used by many parts of the manager. 
     */
    settings: {
        /** Specifies time gaps between spawning child processes. */
        scriptSpawnDelay: string
    }

    /**
     * Defines processes to spawn once the startup sequence has finished.
     */
    processes: Record<string, ProcessConfig>

}

export interface ProcessConfig extends cp.SpawnOptions {
    /** Shell command that summons a CLI app or a script. */
    command: string
    /** Specifies the current working directory for the spawned process. */
    cwd?: string
    /** Specifies whether STDOUT should be ignored or piped to the main process. */
    stdout: 'all' | 'ignore'
}