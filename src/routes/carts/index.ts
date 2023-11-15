import { authentication } from "../../apps/auth/authUtils";
import CartsController from "../../apps/controller/carts.controller";
import { asyncHandler } from "../../helpers/asyncHandler";

const router = require("express").Router();

router.post("/add-new-carts", authentication, asyncHandler(CartsController.addNewCarts));
router.post("/add-to-carts", authentication, asyncHandler(CartsController.addToCarts));
router.post("/update-carts", authentication, asyncHandler(CartsController.updateCarts));
router.post("/get-detail-carts", authentication, asyncHandler(CartsController.getDetailCarts));
router.post("/get-all-carts", authentication, asyncHandler(CartsController.getAllCarts));
router.post("/delete-carts", authentication, asyncHandler(CartsController.deleteCarts));

export default router;
