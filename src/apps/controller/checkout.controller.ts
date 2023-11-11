import { NextFunction } from "express";
import { SuccessResponse } from "../../core/success.response";
import { RequestCustom } from "../auth/authUtils";
import { checkoutReview, orderByUser } from "../services/checkout/checkout.service";

class CheckoutController {
  public static checkoutReview = async (req: RequestCustom, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Process Checkout Review",
      metadata: await checkoutReview(req),
    }).send(res);
  };

  public static orderByUser = async (req: RequestCustom, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Process Order By User",
      metadata: await orderByUser(req),
    }).send(res);
  };
}
export default CheckoutController;
