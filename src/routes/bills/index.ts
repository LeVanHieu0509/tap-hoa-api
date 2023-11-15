import { authentication } from "../../apps/auth/authUtils";

import BillsController from "../../apps/controller/bills.controller";
import { asyncHandler } from "../../helpers/asyncHandler";

const router = require("express").Router();

router.post("/get-bills", authentication, asyncHandler(BillsController.getBills));
router.post("/get-bill", authentication, asyncHandler(BillsController.getBill));

export default router;
