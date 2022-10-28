
import c from 'chalk';

// ================================================================================================

export class BaseError extends Error {

    public name: string;
    public message: string;
    public declare trace: string;

    constructor(message: string, details?: string, templates?: (string|number)[]) {
        super();
        // Capture stack trace leading to this error
        Error.captureStackTrace(this, this.constructor);
        this.name = c.red(this.constructor.name);
        this.message = message;
        
        if (details) this.message = `${this.message}\n\nDetails:\n${c.blue(details)}\n\nStack:`;
        else         this.message = `${this.message}\n\nStack:`;

        if (templates) templates.forEach((template, i) => {
            this.message = this.message.replace(new RegExp(`%${i}`, 'g'), template + '');
        });
    }
}

// ================================================================================================

export class BinInitError extends BaseError {

    constructor(message: string, details?: string, templates?: (string|number)[]) {
        super(message, details, templates);
        Error.captureStackTrace(this, this.constructor);
        this.name = c.red(this.constructor.name);
    }

    public static managerAttachChildExists: [string, string] = [
        `<Manager.class> attachProcess() Duplicate process ${c.green('"%0"')}.`,
        `An attempt was made to attach two processes with the same name.\n` +
        `This is not allowed to happen as the manager is referencing its children\n` +
        `by the names assigned to them when they are being attached.`
    ];
    
}