import { authentication } from "../../apps/auth/authUtils";
import ProductsController from "../../apps/controller/products.controller";
import { asyncHandler } from "../../helpers/asyncHandler";

const router = require("express").Router();

router.get("/user/get-products", authentication, asyncHandler(ProductsController.getProducts));

export default router;
