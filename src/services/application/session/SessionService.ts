import {SessionStrategy} from "./strategy/SessionStrategy";
import {UserService} from "../user/UserService";
import {inject, injectable} from "tsyringe";
import {logger} from "../../../utils/container/container";

@injectable()
export class SessionService{
    private strategy: SessionStrategy;
    private readonly userService: UserService;

    constructor(@inject("SessionStrategy") strategy: SessionStrategy, userService: UserService) {
        this.userService = userService;
        this.strategy = strategy;
    }

    /**
     * Delegates user login to the authentication strategy.
     * @returns A promise that resolves with the result of the login operation.
     * @throws {Error} If any of the parameters inside userData is empty.
     */
    public logIn = async (email: string, password: string): Promise<string> => {
        logger.logDebugFromEntity(`Attempting to logIn user with email: ${email}`, this.constructor);
        const token = await this.strategy.logIn(email, password, this.userService);

        logger.logDebugFromEntity(`Attempt to logIn user with email ${email} was successful. Generated token ${token}.`, this.constructor);
        return token;
    }
}