
# Xilo

## TODOs: 
Features intended for the next version:
- Add event emitters (file watcher, timer, CLI)
- Add management for long-lived processes like compilers or servers.
- Add suport for tasks - functions called on different events like CLI input, file changes etc...
- Add built-in task handlers like "exec", "clone", "restart".
Minor issues:
- Live terminal command messages require a 3th party font.

## Changelog:
01.12.2022 - Merged major live terminal changes to master which include command handling and shell passthrough.
19.11.2022 - Added platform support warnings in the welcome message.  
18.11.2022 - Child processes configured in xilo.config.mjs>processes anow spawn properly after initializing with `xilo run <config>`.  