

import type cp from "child_process"

// ================================================================

export interface Config {
    settings?:  Settings
    terminal?:  LiveTerminalSettings
    processes?: Record<string, ProcessSettings>
}

// ================================================================

/** 
 * Specifies miscellaneous settings used by many parts of the manager. 
 */
export interface Settings {
    /** Specifies time gaps between spawning child processes. */
    scriptSpawnDelay?: number
}
    
// ================================================================

import { ExecutableHandler } from "../src/tools/TerminalTools"

/**
 * Specifies live terminal settings.
 */
export interface LiveTerminalSettings {
    /** If defined LiveTerminal will attempt to pass all unknown commands to the provided shell process. */
    shellPassthrough?: string
    /** Specifies an object containing handlers for different commands. */
    handlers?: Record<string, ExecutableHandler>
}


// ================================================================

/**
 * Defines processes to spawn once the startup sequence has finished.
 */
export interface ProcessSettings extends cp.SpawnOptions {
    /** Shell command that summons a CLI app or a script. */
    command: string
    /** Specifies the current working directory for the spawned process. */
    cwd?: string
    /** Specifies whether STDOUT should be ignored or piped to the main process. */
    stdout?: 'all' | 'ignore'
}

// ================================================================

