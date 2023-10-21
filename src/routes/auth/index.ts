import AuthController from "../../apps/controller/auth.controller";
import { asyncHandler } from "../../helpers/asyncHandler";

const router = require("express").Router();

router.post("/user/signup", asyncHandler(AuthController.signUp));

export default router;
