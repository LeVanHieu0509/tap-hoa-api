import { authentication } from "../../apps/auth/authUtils";

import CategoriesController from "../../apps/controller/categories.controller";
import { asyncHandler } from "../../helpers/asyncHandler";

const router = require("express").Router();

router.post("/get-categories", authentication, asyncHandler(CategoriesController.getCategories));

export default router;
