import { UserRepository } from "../../../interfaces/UserRepository";
import { TypeORMRepository } from "../TypeORMRepository";
import { User } from "../../../../../services/domain/User";
import { StandardDatabaseError } from "../../../../errors/StandardDatabaseError";
import {UserNotFoundError} from "../../../../../services/application/errors/UserNotFoundError";

const PASSWORD_COLUMN_NAME = "password";

export class TypeORMUserRepository extends TypeORMRepository<User> implements UserRepository {
    constructor() {
        super(User);
    }

    /**
     * @inheritDoc
     */
    public getById = async (id: string): Promise<User | null> => {
        try {
            return await this.typeOrmRepository.createQueryBuilder("user")
            .where("user.id = :id", { id })
            .getOne();
        } catch (error: any) {
            throw new StandardDatabaseError(error.message);
        }
    };

    /**
     * @inheritDoc
     */
    public getByEmail = async (email: string): Promise<User | null> => {
        try {
            return await this.typeOrmRepository.createQueryBuilder("user")
            .where("user.email = :email", { email })
            .getOne();
        } catch (error: any) {
            throw new StandardDatabaseError(error.message);
        }
    }

    /**
     * @inheritDoc
     */
    public save = async (user: User): Promise<User> => {
        try {
            return await this.typeOrmRepository.save(user);
        } catch (error: any) {
            throw new StandardDatabaseError(error.message);
        }
    };

    /**
     * @inheritDoc
     */
    public updateUser = async (userId: string, columnName: string, newValue: string): Promise<void> => {
        try {
            const result = await this.typeOrmRepository.createQueryBuilder()
            .update(User)
            .set({ [columnName]: newValue })
            .where("id = :id", { id: userId })
            .execute();

            if (result.affected === 0) throw new UserNotFoundError("User not found with ID " + userId + ".");
        } catch (error: any) {
            throw new StandardDatabaseError(error.message);
        }
    }

    /**
     * @inheritDoc
     */
    public updateUserPassword = async (userId: string, newPassword: string): Promise<void> => {
        return await this.updateUser(userId, PASSWORD_COLUMN_NAME, newPassword);
    }
}
