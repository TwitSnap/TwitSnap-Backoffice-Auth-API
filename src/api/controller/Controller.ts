import {Response} from "express";
import {HttpResponseSender} from "./HttpResponseSender";
import {BadRequestError} from "../errors/BadRequestError";

/**
 * Abstract base class for controllers that handle HTTP responses.
 *
 * This class provides methods for sending standard HTTP responses with different status codes.
 * It uses an instance of `HttpResponseSender` to format and send responses.
 */
export abstract class Controller {
    private _responseSender: HttpResponseSender;

    protected constructor(responseSender: HttpResponseSender){
        this._responseSender = responseSender;
    }

    /**
     * Sets the provided object as the response body and sends the response with status code 200.
     * @param res - The Response object to send.
     * @param object - The object to set as the response body.
     * @throws {Error} If the provided object cannot be converted to the standard body media type.
     */
    protected okResponse = <T>(res: Response, object: T): void => {
        this._responseSender.okResponse(res, object);
    }

    /**
     * Sends the response with status code 204 and no response body.
     * @param res - The Response object to send.
     */
    protected okNoContentResponse = (res: Response): void => {
        this._responseSender.okNoContentResponse(res);
    }

    /**
     * Sets the provided object as the response body and sends the response with status code 201.
     * @param res - The Response object to send.
     * @param object - The object to set as the response body.
     * @throws {Error} If the provided object cannot be converted to the standard body media type.
     */
    protected createdResponse = <T>(res: Response, object: T): void => {
        this._responseSender.createdResponse(res, object);
    }

    /**
     * Retrieves the specified field from the request body. Throws a BadRequestError if the field is not present.
     *
     * @param req - The request object containing the body.
     * @param field - The field to retrieve from the request body.
     * @returns The value of the field from the request body.
     * @throws {BadRequestError} If the field is not present in the request body.
     */
    protected getFieldOrBadRequestError = <T>(req: any, field: string): T => {
        if(!req.body[field]) throw new BadRequestError(`Field ${field} is required`);
        return req.body[field];
    }

    /**
     * Retrieves the specified parameter from the request parameters. Throws a BadRequestError if the parameter is not present.
     *
     * @param req - The request object containing the parameters.
     * @param param - The parameter to retrieve from the request parameters.
     * @returns The value of the parameter from the request parameters.
     * @throws {BadRequestError} If the parameter is not present in the request parameters.
     */
    protected getParamOrBadRequestError = <T>(req: any, param: string): T => {
        if(!req.params[param]) throw new BadRequestError(`Parameter ${param} is required`);
        return req.body[param];
    }
}