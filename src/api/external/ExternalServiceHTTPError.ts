export class ExternalServiceHTTPError extends Error {
    public constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, ExternalServiceHTTPError.prototype);
    }
}