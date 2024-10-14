export class InvalidCredentialsFormat extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidCredentialsFormat.prototype);
    }
}