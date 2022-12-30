

// This file contains basic tools for the user to use inside
// the configuration file.

import os from "os"

function getUserShell() {
    try   { return os.userInfo().shell } 
    catch { return undefined           }
}

export function getDefaultShell() {

    const { platform, env } = process
    const userShell = getUserShell()

    if (userShell) return userShell

    if (platform === `darwin`) return env.SHELL   || `/bin/zsh`
    if (platform === `linux`)  return env.SHELL   || `/bin/sh`
    if (platform === `win32`)  return env.COMSPEC || `C:\\Windows\\system32\\cmd.exe`

    throw new Error("getDefaultShell() - Could not find a default shell.")

}