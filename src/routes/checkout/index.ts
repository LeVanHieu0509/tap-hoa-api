import { orderByUser } from "./../../apps/services/checkout/checkout.service";
import { authentication } from "../../apps/auth/authUtils";
import CartsController from "../../apps/controller/carts.controller";
import CheckoutController from "../../apps/controller/checkout.controller";
import { asyncHandler } from "../../helpers/asyncHandler";

const router = require("express").Router();

router.post("/review", authentication, asyncHandler(CheckoutController.checkoutReview));
router.post("/confirm", authentication, asyncHandler(CheckoutController.orderByUser));

export default router;
