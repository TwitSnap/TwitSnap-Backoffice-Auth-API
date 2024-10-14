import {Controller} from "./Controller";
import {HttpResponseSender} from "./HttpResponseSender";
import {NextFunction, Request, Response} from "express";
import {UserService} from "../../services/application/user/UserService";
import {SessionService} from "../../services/application/session/SessionService";
import {injectable} from "tsyringe";
import {User} from "../../services/domain/User";

@injectable()
export class UserController extends Controller {
    private userService: UserService;
    private sessionService: SessionService;

    constructor(userService: UserService, sessionService: SessionService, httpResponseSender: HttpResponseSender) {
        super(httpResponseSender);
        this.userService = userService;
        this.sessionService = sessionService;
    }

    /**
     * Registers a new user with the provided email and password.
     *
     * @param req - The request object containing user ID and password.
     * @param res - The response object to send.
     * @param next - The next function for error handling.
     */
    public register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const email = this.getFieldOrBadRequestError(req, 'email') as string;
            const password = this.getFieldOrBadRequestError(req, 'password') as string;

            await this.userService.register(email, password);
            return this.createdResponse(res, {message: 'User registered successfully.'});
        } catch (error) {
            next(error);
        }
    }

    /**
     * Logs in a user with the provided email and password.
     *
     * @param req - The request object containing email and password.
     * @param res - The response object to send.
     * @param next - The next function for error handling.
     */
    public logIn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const email = this.getFieldOrBadRequestError(req, 'email') as string;
            const password = this.getFieldOrBadRequestError(req, 'password') as string;

            const token = await this.sessionService.logIn(email, password);
            return this.okResponse(res, {token: token});
        } catch (error) {
            next(error);
        }
    }

    /**
     * Authenticates a user based on the provided user ID.
     *
     * @param req - The request object containing user ID.
     * @param res - The response object to send.
     * @param next - The next function for error handling.
     */
    public authenticate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user as User;
            return this.okResponse(res, {userId: user.getId()});
        } catch (error) {
            next(error);
        }
    }

    /**
     * Initiates the forgot password process for the provided email.
     *
     * @param req - The request object containing the email.
     * @param res - The response object to send.
     * @param next - The next function for error handling.
     */
    public forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const email = this.getFieldOrBadRequestError(req, 'email') as string;
            await this.userService.forgotPassword(email);
            return this.okNoContentResponse(res);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Checks if the reset password token is valid.
     *
     * @param req - The request object containing the token.
     * @param res - The response object to send.
     * @param next - The next function for error handling.
     */
    public resetPasswordTokenIsValid = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = this.getParamOrBadRequestError(req, 'token') as string;
            const isValid = await this.userService.resetPasswordTokenIsValid(token);

            return this.okResponse(res, {isValid: isValid});
        } catch (error) {
            next(error);
        }
    }

    /**
     * Updates the user's password using the provided reset password token and new password.
     *
     * @param req - The request object containing the token and new password.
     * @param res - The response object to send.
     * @param next - The next function for error handling.
     */
    public updatePasswordWithToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = this.getFieldOrBadRequestError(req, 'token') as string;
            const newPassword = this.getFieldOrBadRequestError(req, 'newPassword') as string;
            await this.userService.updatePasswordWithToken(token, newPassword);

            return this.okNoContentResponse(res);
        } catch (error) {
            next(error);
        }
    }
}