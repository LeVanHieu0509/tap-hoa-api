import RabbitMQController from "../../apps/controller/rabbit-mq";
import UserController from "../../apps/controller/user";
import { asyncHandler } from "../../helpers/asyncHandler";

const router = require("express").Router();

router.post("/", asyncHandler(UserController.insert));

export default router;
