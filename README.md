
# Xilo

## TODOs: 
Features intended for the next version:
- Add management for long-lived processes like compilers or servers.
- Add suport for tasks - functions called on different events like CLI input, file changes etc...
- Add built-in task handlers like "exec", "clone", "restart".
- Add event emitters (file watcher, timer, CLI)

## Changelog:
19.11.2022 - Added platform support warnings in the welcome message.  
18.11.2022 - Child processes configured in xilo.config.js>processes anow spawn properly after initializing with `xilo run <config>`.  