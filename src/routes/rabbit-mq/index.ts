import RabbitMQController from "../../apps/controller/rabbit-mq";
import { asyncHandler } from "../../helpers/asyncHandler";

const router = require("express").Router();

router.post(
  "/send-noti-failed",
  asyncHandler(RabbitMQController.handleNotiSendError)
);
router.post("/post-video", asyncHandler(RabbitMQController.postVideo));
router.post("/send-email", asyncHandler(RabbitMQController.sendEmail));
router.post("/send-log", asyncHandler(RabbitMQController.sendLog));
router.post(
  "/send-order",
  asyncHandler(RabbitMQController.producerOrderedMessageNormal)
);

export default router;
