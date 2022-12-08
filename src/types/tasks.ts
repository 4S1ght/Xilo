
export namespace Tasks {

    export interface Exec {
        /** Command to execute */
        command: string
        /** Shell used to run the command. Defaults to system default, could be `cmd.exe`, `bash`, etc... */
        shell?: string
        /** Cwd for the working script. Defaults to the position of the configuration file. */
        cwd?: string        
        /** Whether or not to display command output in the terminal. Defaults to `true`. */
        output?: boolean
        /** Whether or not to exit the app if command throws an error. Defaults to `true`. */
        ignoreErrors?: boolean
    }
    
    export interface Clone {
        /** Source directory */
        from: string
        /** Destination directory */
        to: string
        /** Regex pattern */
        filter: string | string[]
        /** Flags */
        flags?: string
        /** Whether or not to print out the files/dirs copied */
        output?: boolean
    }
    
}