import { container } from "tsyringe";
import "reflect-metadata";
import {DatabaseConnector} from "../../db/connectors/DatabaseConnector";
import {Logger} from "../logger/Logger";
import {UserController} from "../../api/controller/UserController";
import {UserService} from "../../services/application/user/UserService";
import {Encrypter} from "../encrypter/Encrypter";
import {BcryptEncrypter} from "../encrypter/BcryptEncrypter";
import {SessionStrategy} from "../../services/application/session/strategy/SessionStrategy";
import {TokenSessionStrategy} from "../../services/application/session/strategy/TokenSessionStrategy";
import {UserRepository} from "../../db/repositories/interfaces/UserRepository";
import {TypeORMUserRepository} from "../../db/repositories/impls/TypeORM/user/TypeORMUserRepository";
import {LoggingStrategy} from "../logger/LoggingStrategy";
import {WinstonLoggerStrategy} from "../logger/WinstonLoggerStrategy";
import {TypeORMDatabaseConnectorStrategy} from "../../db/connectors/TypeORMDatabaseConnectorStrategy";
import {DatabaseConnectorStrategy} from "../../db/connectors/DatabaseConnectorStrategy";
import {DataSource} from "typeorm";
import {LOGGING, LOG_DEBUG, LOG_ERROR, LOG_INFO} from "../config";

// ? Register all dependencies
container.registerSingleton<Encrypter>("Encrypter", BcryptEncrypter);

container.register<LoggingStrategy>("LoggingStrategy", { useClass: WinstonLoggerStrategy});
container.register<boolean>("logging", {useValue: (LOGGING === "true") });
container.register<boolean>("logDebug", {useValue: (LOG_DEBUG === "true") });
container.register<boolean>("logError", {useValue: (LOG_ERROR === "true") });
container.register<boolean>("logInfo", {useValue: (LOG_INFO === "true") });

container.register<DatabaseConnectorStrategy<DataSource, DataSource>>("DatabaseConnectorStrategy", TypeORMDatabaseConnectorStrategy);
container.register<SessionStrategy>("SessionStrategy", TokenSessionStrategy);
container.register<UserRepository>("UserRepository", TypeORMUserRepository);

// ? Get instances
export const logger = container.resolve(Logger);
export const databaseConnector = container.resolve(DatabaseConnector<DataSource, DataSource>);
export const userController = container.resolve(UserController);
export const userService = container.resolve(UserService);