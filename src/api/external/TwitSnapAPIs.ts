import {HttpRequester} from "./HttpRequester";
import {NOTIFICATIONS_MS_URI, SEND_NOTIFICATION_ENDPOINT_PATH} from "../../utils/config";
import {ExternalServiceInternalError} from "../../services/application/errors/ExternalServiceInternalError";
import {ExternalServiceConnectionError} from "../../services/application/errors/ExternalServiceConnectionError";
import {logger} from "../../utils/container/container";
import {ExternalServiceHTTPError} from "./ExternalServiceHTTPError";
import {injectable} from "tsyringe";

const RESET_PASSWORD_EVENT_TYPE = "reset-password";
const ADMIN_INVITATION_EVENT_TYPE = "admin-invitation";

@injectable()
export class TwitSnapAPIs{
    httpRequester: HttpRequester;

    constructor(httpRequester: HttpRequester){
        this.httpRequester = httpRequester;
    }

    /**
     * Sends an email notification to the specified destinations.
     * @param {string[]} destinations - The email addresses to send the notification to.
     * @param {string} type - The type of notification to send.
     * @param {string} sender - The email address of the sender.
     * @param {any} params - The parameters to include in the notification.
     * @param {(e: any) => void} errorHandler - The error handler for the request.
     * @throws {ExternalServiceHTTPError} If the external service returns an unexpected status code.
     */
    public sendEmailNotification = async (destinations: string[], type: string, sender: string, params: any, errorHandler: (e: any) => void): Promise<void> => {
        const url = NOTIFICATIONS_MS_URI + SEND_NOTIFICATION_ENDPOINT_PATH;

        const data = {
            type: type,
            params: params,
            notifications: {
                type: "email",
                destinations: destinations,
                sender: sender
            }
        }

        await this.httpRequester.postToUrl(url, data, errorHandler);
    }

    public sendAdminInvitationNotification = async (destinations: string[], token: string): Promise<void> => {
        await this.sendEmailNotification(destinations, ADMIN_INVITATION_EVENT_TYPE, "twitsnap.backoffice@gmail.com", {token: token}, this.sendAdminInvitationNotificationErrorHandler);
    }

    /**
     * Only for operation: sendAdminInvitationNotificationErrorHandler
     *
     * @param e - The error object from the failed request.
     * @throws {ExternalServiceHTTPError} If the external service returns an unexpected status code.
     */
    private sendAdminInvitationNotificationErrorHandler = (e: any): void => {
        this.standardErrorHandler(e, this.sendAdminInvitationNotificationResponseStatusErrorHandler);
    }

    /**
    * Only for operation: sendAdminInvitationNotificationErrorHandler
    *
    * Generates an error based on the response status for sending the admin invitation notification.
     */
    private sendAdminInvitationNotificationResponseStatusErrorHandler = (status: number): Error => {
        switch (status) {
            default:
                return new ExternalServiceHTTPError(`sendAdminInvitationNotification API Call has failed with status ${status}.`);
        }
    }

    /**
     * Sends a reset password notification to the user.
     * @param {string[]} destinations - The email addresses to send the notification to.
     * @param {string} token - The reset password token.
     * @throws {ExternalServiceHTTPError} If the external service returns an unexpected status code.
     */

    public sendResetPasswordNotification = async (destinations: string[], token: string): Promise<void> => {
        await this.sendEmailNotification(destinations, RESET_PASSWORD_EVENT_TYPE, "twitsnap.backoffice@gmail.com", {token: token}, this.sendResetPasswordNotificationErrorHandler);
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