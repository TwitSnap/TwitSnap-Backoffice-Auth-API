export class UserNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, UserNotFoundError.prototype);
    }
}