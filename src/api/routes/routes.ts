import { Router } from "express";
import { userController } from "../../utils/container/container";
import {PassportAuthService} from "../../services/application/session/PassportAuthService";

const router = Router();

router.post("/v1/auth/register", userController.register);                                              // ? Ruta de registro de usuario
router.post("/v1/auth/login", userController.logIn);                                                    // ? Ruta de inicio de sesión
router.get("/v1/auth/:token", PassportAuthService.authenticate, userController.authenticate);           // ? Ruta de autenticacion de usuario

router.post("/v1/auth/password", userController.forgotPassword);                                        // ? Ruta de reseteo de contraseña
router.patch("/v1/auth/password", userController.updatePasswordWithToken);                              // ? Ruta de actualización de contraseña
router.get("/v1/auth/resetPasswordToken/valid/:token", userController.resetPasswordTokenIsValid);       // ? Ruta de validación de token de reseteo de contraseña

//TODO Se debe agregar autenticación para la siguiente ruta. Ahora se saca porque hay un bug.
// Se debe modificar authenticate para que saque el token de bearer token y no como un query param
//router.post("/v1/auth/invitation", PassportAuthService.authenticate, userController.inviteUser);         // ? Ruta de invitación de admin
router.post("/v1/auth/invitation", userController.inviteUser);

export default router;