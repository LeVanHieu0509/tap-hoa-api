import { routerPrivate } from "../../apps/auth/authUtils";
import AuthController from "../../apps/controller/auth.controller";
import { asyncHandler } from "../../helpers/asyncHandler";
const { celebrate } = require("celebrate");
const dto = require("../../apps/dto/signin.dto");

const router = require("express").Router();

router.post("/signup", asyncHandler(AuthController.signUp));
router.post("/login", asyncHandler(AuthController.login));
router.post("/refresh-token", asyncHandler(AuthController.refreshToken));
router.post("/logout", asyncHandler(AuthController.logout));
router.post("/changePass", asyncHandler(AuthController.changePass));
router.post("/get-users", routerPrivate, asyncHandler(AuthController.getUsers));
router.post("/reset-password", routerPrivate, asyncHandler(AuthController.resetPassword));
router.post("/delete-user", routerPrivate, asyncHandler(AuthController.deleteUser));

export default router;
