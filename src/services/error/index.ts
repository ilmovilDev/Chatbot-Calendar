export class AppError extends Error {
    public ubication: string;
    public originalError: any;

    constructor(ubication: string, message: string, originalError?: any) {
        super(message);
        this.ubication = ubication;
        this.originalError = originalError;
        Object.setPrototypeOf(this, AppError.prototype);
    }

    toString() {
        return `[${this.ubication}] ${this.message}`;
    }
}
