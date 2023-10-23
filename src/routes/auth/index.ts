import AuthController from "../../apps/controller/auth.controller";
import { asyncHandler } from "../../helpers/asyncHandler";
const { celebrate } = require("celebrate");
const dto = require("../../apps/dto/signin.dto");

const router = require("express").Router();

router.post("/user/signup", celebrate(dto.signUpDto), asyncHandler(AuthController.signUp));

export default router;
