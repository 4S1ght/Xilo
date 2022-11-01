

// Terminal
export const T_COLOR_TITLE  = "#ffa139"
export const T_COLOR_LINK   = "#ffcf65"
export const T_COLOR_TEXT   = "grey"

export const T_PREFIX_BIG   = 'Xilo >'
export const T_PREFIX_SMALL = '>'

// Program
export const CNF_BASE       = 'xilo.config'
export const CNF_EXT        = ['.js', '.ts']
export const CNF_NAME_JS    = CNF_BASE + CNF_EXT[0]
export const CNF_NAME_TS    = CNF_BASE + CNF_EXT[1]

// Templates
export const CNF_TEMPLATE = `
module.exports =  {

    /** Specifies miscellaneous settings used by many parts of the manager. */
    settings: {
        /** Specifies time gaps between spawning child processes. */
        scriptSpawnDelay: 1 * 1000
    },

    /**
     * Defines processes to spawn once the startup sequence has finished.
     */
    processes: {
        /** Process name and its configuration */
        typescript: {
            /** Shell command that summons a CLI app or a script. */
            command: "tsc -w",
            /** Specifies the current working directory for the spawned process. */
            cwd: "./src",
            /** Specifies whether STDOUT should be ignored or piped to the main process. */
            stdout: 'all'
        }
    }

}
`;