import { NextFunction } from "express";
import { SuccessResponse } from "../../core/success.response";
import { RequestCustom } from "../auth/authUtils";
import { getBill, getBills } from "../services/bills/bills.service";
import { getOverviewDashboard } from "../services/dashboard/dashboard.service";

class DashboardController {
  public static getOverviewDashboard = async (req: RequestCustom, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Process Bills System",
      metadata: await getOverviewDashboard(),
    }).send(res);
  };

  public static getBill = async (req: RequestCustom, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Process Bills System",
      metadata: await getBill(req),
    }).send(res);
  };
}
export default DashboardController;
