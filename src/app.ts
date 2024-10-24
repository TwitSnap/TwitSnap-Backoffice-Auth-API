import "reflect-metadata";
import express from "express";
import router from "./api/routes/routes";
import {errorMiddleware} from "./api/errors/handling/ErrorHandler";
import {databaseConnector} from "./utils/container/container";
import {logger} from "./utils/container/container";
import {PORT} from "./utils/config";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from './utils/swagger/docs/swaggerDocs.json';
import {PassportAuthService} from "./services/application/session/PassportAuthService";

const app = express();
const passport = PassportAuthService.getPassport();

app.use(express.json());
app.use(router)
app.use(errorMiddleware);
app.use(passport.initialize());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

databaseConnector.initializeConnection().then(() => {
    app.listen(PORT, () => {
        logger.logInfo(`Server is running on port ${PORT}`);
    });
});