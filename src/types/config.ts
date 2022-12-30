
import type * as cp from 'child_process'
import type * as Events from '../events/Events'
import type * as misc from './misc'

// Default ====================================================================

export interface Config {
    /** 
     * The "terminal" objects provides configuration options for the integrated terminal interface.
     * It allows to specify a `passthroughShell` to pass all unidentified commands to a shell, provides
     * a way to keep command history between sessions using `keepHistory` or even register custom commands
     * along with their handlers.
     */
    terminal?:  LiveTerminalSettings
    processes?: ProcessConfig
    tasks?:     TasksConfig
}

    
// Live terminal ==============================================================

/**
 * Specifies live terminal settings.
 */
export interface LiveTerminalSettings {
    /** If defined LiveTerminal will attempt to pass all unknown commands to the provided shell process. */
    passthroughShell?: string
    /** Specifies an object containing handlers for different commands. */
    handlers?: Record<string, Events.EventHandler<Events.LiveTerminalCommandEvent>>
    /** If specified, live terminal will retain a given amount of commands in history across sessions. */
    keepHistory?: number
}


// Child processes ============================================================

/**
 * Defines processes to spawn once the startup sequence has finished.
 */
export interface ProcessSpawnOptions extends cp.SpawnOptions {
    /** Shell command that summons a CLI app or a script. */
    command: string
    /** Specifies the current working directory for the spawned process. */
    cwd?: string
    /** Specifies whether STDOUT should be ignored or piped to the main process. */
    stdout?: 'all' | 'ignore'
}

export type ProcessSettingsCreator = ProcessSpawnOptions | (() => ProcessSpawnOptions)

export interface ProcessConfig {
    /** Specifies time delays between each spawned process. */
    timing: number
    /** Specifies child processes and their configuration. */
    items?: Record<string, ProcessSettingsCreator>
}

// Startup tasks ==============================================================

export interface Task {

}
export interface TasksConfig {
    timing?: number
    ignoreErrors?: boolean
    items?: Array<Events.EventHandler<Events.XiloEvent>>
}