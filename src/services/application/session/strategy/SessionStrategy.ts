import {UserService} from "../../user/UserService";

export interface SessionStrategy {
    /**
     * Logs the user in.
     * @param email - The email of the user trying to log in.
     * @param password - The password of the user trying to log in.
     * @param userService - The UserService instance to interact with user data.
     * @returns A promise that resolves with the result of the login operation (e.g., a token).
     */
    logIn(email: string, password: string, userService: UserService): Promise<string>;
}
