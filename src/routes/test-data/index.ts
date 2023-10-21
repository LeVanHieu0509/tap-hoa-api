import UserController from "../../apps/controller/auth.controller";
import { asyncHandler } from "../../helpers/asyncHandler";

const router = require("express").Router();

router.post("/", asyncHandler(UserController.insert));

export default router;
