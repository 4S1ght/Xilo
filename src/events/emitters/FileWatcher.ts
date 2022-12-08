
import fs from 'fs'
import path from 'path'
import c from 'chalk'
import { Delay } from '../../other/Utils'
import { SelfOrList } from '../../types/misc'

interface WatcherConfig {
    /** 
     * Specifies files or directories to watch. 
    */
    files: SelfOrList<string>
    /** 
     * Specifies a cooldown during which events will not be emitted.  
     * **Note:** The cooldown is applied separately for each specified
     * watch target.
    */
    cooldown?: number
    /**
     * A function called whenever `fs.watch` emits an event
     */
    callback: (changedFile: string) => any
    
}