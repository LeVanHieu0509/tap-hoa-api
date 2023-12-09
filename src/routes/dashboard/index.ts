import { authentication } from "../../apps/auth/authUtils";

import DashboardController from "../../apps/controller/dashboard.controller";
import { asyncHandler } from "../../helpers/asyncHandler";

const router = require("express").Router();

router.post("/get-overview", authentication, asyncHandler(DashboardController.getOverviewDashboard));

export default router;
