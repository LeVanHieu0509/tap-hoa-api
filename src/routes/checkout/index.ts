import { authentication } from "../../apps/auth/authUtils";
import CheckoutController from "../../apps/controller/checkout.controller";
import { asyncHandler } from "../../helpers/asyncHandler";

const router = require("express").Router();

router.post("/review", authentication, asyncHandler(CheckoutController.checkoutReview));
router.post("/confirm", authentication, asyncHandler(CheckoutController.orderByUser));
router.post("/cancel", authentication, asyncHandler(CheckoutController.cancelByUser));

export default router;
