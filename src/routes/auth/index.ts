import AuthController from "../../apps/controller/auth.controller";
import { asyncHandler } from "../../helpers/asyncHandler";
const { celebrate } = require("celebrate");
const dto = require("../../apps/dto/signin.dto");

const router = require("express").Router();

router.post("/user/signup", celebrate(dto.signUpDto), asyncHandler(AuthController.signUp));
router.post("/user/login", asyncHandler(AuthController.login));
router.post("/user/refresh-token", asyncHandler(AuthController.refreshToken));
router.post("/user/logout", asyncHandler(AuthController.logout));
router.post("/user/changePass", asyncHandler(AuthController.changePass));

export default router;
