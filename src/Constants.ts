
export const LOG_PREFIX = 'Xilo > ';

export const DEFAULT_CNF_NAME = 'xilo.config.js'
export const CNF_TEMPLATE = `
module.exports = {

    /** Specifies scripts to run side by side in the terminal. */
    scripts: {
        /** Process name and its configuration */
        typescript: {
            /** Specifies the command used to spawn a process. */
            spawn: 'tsc -w',
            /** 
             * Specifies script spawn method. Use "fork" when spawning Node 
             * modules to monitor their resource usage from the CLI. 
             */
            spawMethod: 'spawn',
            /** Specifies whether or not to show process output. */
            stdout: true
        }
    },

    /** Specifies a set of tasks to execute once the manager is started. */
    startupTasks: {
        hello: () => {
            console.log('Hello!')
        }
    }
    
}`;