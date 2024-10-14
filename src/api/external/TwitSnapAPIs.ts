import {HttpRequester} from "./HttpRequester";
import {NOTIFICATIONS_MS_URI, SEND_NOTIFICATION_ENDPOINT_PATH} from "../../utils/config";
import {ExternalServiceInternalError} from "../../services/application/errors/ExternalServiceInternalError";
import {ExternalServiceConnectionError} from "../../services/application/errors/ExternalServiceConnectionError";
import {logger} from "../../utils/container/container";
import {ExternalServiceHTTPError} from "./ExternalServiceHTTPError";
import {injectable} from "tsyringe";

@injectable()
export class TwitSnapAPIs{
    httpRequester: HttpRequester;

    constructor(httpRequester: HttpRequester){
        this.httpRequester = httpRequester;
    }

    /**
     * Sends a reset password notification to the user.
     * @param {string[]} destinations - The email addresses to send the notification to.
     * @param {string} token - The reset password token.
     * @throws {ExternalServiceHTTPError} If the external service returns an unexpected status code.
     */

    public sendResetPasswordNotification = async (destinations: string[], token: string): Promise<void> => {
        const url = NOTIFICATIONS_MS_URI + SEND_NOTIFICATION_ENDPOINT_PATH;

        const data = {
            type: "reset-password",
            params: {
                token: token
            },
            notifications: {
                type: "email",
                destinations: destinations,
                sender: "grupo8memo2@gmail.com"
            }
        }

        const errorHandler = this.sendResetPasswordNotificationErrorHandler;

        await this.httpRequester.postToUrl(url, data, errorHandler);
    }


    /**
     * Only for operation: sendResetPasswordNotificationErrorHandler
     *
     * Handles errors related to the external HTTP request.
     * @param {any} e - The error object from the failed request.
     * @throws {ExternalServiceHTTPError} If the request returned an unexpected status code.
     */
    private sendResetPasswordNotificationErrorHandler = (e: any): void => {
        this.standardErrorHandler(e, this.sendResetPasswordNotificationResponseStatusErrorHandler);
    }


    /**
     * Only for operation: sendResetPasswordNotificationErrorHandler
     *
     * Generates an error based on the response status for sending the reset password notification.
     *
     * @param {number} status - The HTTP status code.
     * @returns {Error} The generated error object.
     */
    private sendResetPasswordNotificationResponseStatusErrorHandler = (status: number): Error => {
        switch (status) {
            default:
                return new ExternalServiceHTTPError(`sendResetPasswordNotification API Call has failed with status ${status}.`);
        }
    }


    /**
     * Handles errors related to the external HTTP request.
     * @param {any} e - The error object from the failed request.
     * @param {(status: number) => Error} responseStatusErrorHandler - The error handler for the response status.
     * @throws {Error} The generated error object.
     */
    private standardErrorHandler = (e: any, responseStatusErrorHandler: (status: number) => Error): void => {
        let error;

        if(e.response){
            error = responseStatusErrorHandler(e.response.status);
        } else if(e.request){
            error = new ExternalServiceInternalError("Timeout while waiting for an external service.");
        } else {
            error = new ExternalServiceConnectionError("Error while connecting to an external service.")
        }

        logger.logErrorFromEntity(("Caught error: " + e.message), this.constructor);
        logger.logErrorFromEntity(("Throwing error: " + error.message), this.constructor);

        throw error;
    }
}