import { User } from "../../../services/domain/User";

export interface UserRepository {
    /**
     * Retrieves a `User` entity by its unique identifier.
     *
     * @param id - The unique identifier of the User.
     * @returns A promise that resolves to the `User` entity if found, or `null` if not found.
     */
    getById: (id: string) => Promise<User | null>;

    /**
     * Retrieves a `User` entity by its email.
     *
     * @param email - The email of the User.
     * @returns A promise that resolves to the `User` entity if found, or `null` if not found
     */
    getByEmail: (email: string) => Promise<User | null>;

    /**
     * Saves a new or existing `User` entity to the storage.
     *
     * @param user - The `User` entity to be saved.
     * @returns A promise that resolves to the saved `User` entity.
     */
    save: (user: User) => Promise<User>;

    /**
     * Updates a user's information.
     *
     * @param userId - The unique identifier of the user.
     * @param columnName - The name of the column to be updated.
     * @param newValue - The new value for the column.
     * @returns A promise that resolves to the updated `User` entity.
     */
    updateUser: (userId: string, columnName: string, newValue: string) => Promise<void>;

    /**
     * Updates a user's password.
     *
     * @param userId - The unique identifier of the user.
     * @param newPassword - The new password for the user.
     * @returns A promise that resolves when the password is updated.
     */
    updateUserPassword: (userId: string, newPassword: string) => Promise<void>;
}
