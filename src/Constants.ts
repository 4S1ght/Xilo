
export const LOG_PREFIX = 'Xilo > ';
export const CLI_LOG_PREFIX = '➜'

export const DEFAULT_CNF_NAME = 'xilo.config.js'
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