

export const T_PREFIX_BIG   = 'Xilo >'
export const T_PREFIX_SMALL = '>'

// Program
export const CNF_FILE_NAME  = 'xilo.config.js'

// Templates
export const CNF_TEMPLATE = `
export default {

    // Miscellaneous settings used by many parts of the manager.
    settings: {
        // Specifies time gaps between spawning child processes.
        scriptSpawnDelay: 1 * 500
    },

    // Terminal settings
    terminal: {
        shellPassthrough: "powershell.exe"
    },

    // Defines processes to spawn once the startup sequence has finished.
    processes: {
        // Process name and its configuration
        c1: {
            // Shell command that summons a CLI app or a script.
            command: "node tests/counter.js",
            // Specifies the current working directory for the spawned process.
            cwd: "./",
            // Specifies whether STDOUT should be ignored or piped to the main process.
            stdout: 'all'
        }
    }

}
`