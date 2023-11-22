import { authentication } from "../../apps/auth/authUtils";
import ProductsController from "../../apps/controller/products.controller";
import { asyncHandler } from "../../helpers/asyncHandler";

const router = require("express").Router();

router.post("/get-product", authentication, asyncHandler(ProductsController.getProduct));
router.post("/get-products", authentication, asyncHandler(ProductsController.getProducts));
router.post("/create-product", authentication, asyncHandler(ProductsController.createProduct));
router.post("/delete-product", authentication, asyncHandler(ProductsController.deleteProduct));
router.post("/update-product", authentication, asyncHandler(ProductsController.updateProduct));
router.post("/general-auto-product", authentication, asyncHandler(ProductsController.generalAutoProduct));

export default router;
