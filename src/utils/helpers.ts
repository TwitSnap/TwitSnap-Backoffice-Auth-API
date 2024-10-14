import { StatusCodes } from "http-status-codes";
import { MissingEnvVarError } from "../services/application/errors/MissingEnvVarError";
import {InvalidCredentialsError} from "../services/application/errors/InvalidCredentialsError";
import {BadRequestError} from "../api/errors/BadRequestError";
import {StandardDatabaseError} from "../db/errors/StandardDatabaseError"
import {InvalidRegisterCredentialsError} from "../services/application/errors/InvalidRegisterCredentialsError";
import {ExternalServiceConnectionError} from "../services/application/errors/ExternalServiceConnectionError";
import {InvalidExternalServiceResponseError} from "../services/application/errors/InvalidExternalServiceResponseError";
import {ExternalServiceInternalError} from "../services/application/errors/ExternalServiceInternalError";
import * as jwt from "jsonwebtoken";
import {ExternalServiceHTTPError} from "../api/external/ExternalServiceHTTPError";
import {InvalidTokenError} from "jwt-decode";
import {InvalidCredentialsFormat} from "../services/application/errors/InvalidCredentialsFormat";

/**
 * A utility class for various helper functions.
 */
export class Helpers {
    private static _errorStatusCodeMap: Map<Function, StatusCodes> = new Map<Function, StatusCodes>();

    /**
     * Validates a list of environment variables.
     * Throws an error for each missing environment variable.
     *
     * @param envVarsList - An array of environment variable names to validate.
     */
    public static validateEnvVarsList = (envVarsList: string[]): void => {
        envVarsList.forEach((envVar) => {
            Helpers.validateEnvVar(envVar);
        });
    }

    /**
     * Validates a single environment variable.
     * Throws an error if the environment variable is missing.
     *
     * @param envVar - The name of the environment variable to validate.
     */
    public static validateEnvVar = (envVar: string): void => {
        console.log(process.env[envVar]);
        if (!process.env[envVar]) throw new MissingEnvVarError(`Environment variable ${envVar} is missing`);
    }

    /**
     * Generates a JWT token for the given object literal.
     *
     * @param objectLiteral The object literal to be included in the token payload.
     * @param secret The secret key used to sign the token.
     * @param expirationTime The expiration time for the token.
     * @returns A signed JWT token.
     */
    public static generateToken = <T extends Object>(objectLiteral: T, secret: string, expirationTime: string): string => {
        return jwt.sign(objectLiteral, secret, { expiresIn: expirationTime });
    }

    /**
     * Verifies whether a token is valid.
     *
     * @param token The token to verify.
     * @param secret The secret key used to sign the token.
     * @returns True if the token is valid, false otherwise.
     */
    public static tokenIsValid = (token: string, secret: string): Promise<boolean> => {
        return new Promise((resolve) => {
            jwt.verify(token, secret, (err) => {
                if (err) return resolve(false);
                return resolve(true);
            });
        });
    }

    /**
     * Retrieves data from a token.
     *
     * @param token The token to retrieve data from.
     * @param key The key of the data to retrieve.
     * @param secret The secret key used to sign the token.
     * @returns The data from the token.
     */
    public static getDataFromToken = (token: string, key: string, secret: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secret, (err, decoded) => {
                if (err) return reject(new InvalidTokenError());
                if (typeof decoded === "string" || typeof decoded === "undefined" || decoded === null) return reject(new InvalidTokenError());

                resolve(decoded[key]);
            });
        });
    }

    /**
     * Maps an error to its corresponding HTTP status code.
     * If no mapping is found, returns 500 Internal Server Error.
     *
     * @param error - The error to map to an HTTP status code.
     * @returns The HTTP status code corresponding to the error.
     */
    public static mapErrorToStatusCode = (error: Error): StatusCodes => {
        if (Helpers._errorStatusCodeMap.size === 0) Helpers.initializeErrorStatusCodeMap();
        return Helpers.getErrorStatusCode(error);
    }

    /**
     * Retrieves the HTTP status code for a given error.
     *
     * @param error - The error to get the status code for.
     * @returns The HTTP status code corresponding to the error.
     */
    private static getErrorStatusCode = (error: Error): StatusCodes => {
        let errorStatusCode = Helpers._errorStatusCodeMap.get(error.constructor);
        if (errorStatusCode === undefined) errorStatusCode = StatusCodes.INTERNAL_SERVER_ERROR;

        return errorStatusCode;
    }

    /**
     * Initializes the map of error types to HTTP status codes.
     */
    private static initializeErrorStatusCodeMap = (): void => {
        Helpers._errorStatusCodeMap.set(MissingEnvVarError, StatusCodes.INTERNAL_SERVER_ERROR);
        Helpers._errorStatusCodeMap.set(StandardDatabaseError, StatusCodes.INTERNAL_SERVER_ERROR);
        Helpers._errorStatusCodeMap.set(ExternalServiceConnectionError, StatusCodes.INTERNAL_SERVER_ERROR);
        Helpers._errorStatusCodeMap.set(InvalidExternalServiceResponseError, StatusCodes.INTERNAL_SERVER_ERROR);
        Helpers._errorStatusCodeMap.set(ExternalServiceInternalError, StatusCodes.INTERNAL_SERVER_ERROR)
        Helpers._errorStatusCodeMap.set(ExternalServiceHTTPError, StatusCodes.INTERNAL_SERVER_ERROR);
        Helpers._errorStatusCodeMap.set(BadRequestError, StatusCodes.BAD_REQUEST);

        Helpers._errorStatusCodeMap.set(InvalidRegisterCredentialsError, StatusCodes.CONFLICT);
        Helpers._errorStatusCodeMap.set(InvalidCredentialsFormat, StatusCodes.CONFLICT);

        Helpers._errorStatusCodeMap.set(InvalidTokenError, StatusCodes.UNAUTHORIZED);
        Helpers._errorStatusCodeMap.set(InvalidCredentialsError, StatusCodes.UNAUTHORIZED);
    }
}
