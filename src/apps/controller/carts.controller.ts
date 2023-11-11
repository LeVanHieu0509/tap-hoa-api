import { NextFunction, Request } from "express";
import { SuccessResponse } from "../../core/success.response";
import { RequestCustom } from "../auth/authUtils";
import {
  addNewCarts,
  addToCarts,
  deleteCarts,
  getAllCarts,
  getDetailCarts,
  updateCarts,
} from "../services/carts/carts.service";

class CartsController {
  public static addNewCarts = async (req: RequestCustom, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Process Add New Carts",
      metadata: await addNewCarts(req),
    }).send(res);
  };

  public static addToCarts = async (req: RequestCustom, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Process Add To Carts",
      metadata: await addToCarts(req),
    }).send(res);
  };

  public static updateCarts = async (req: RequestCustom, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Process Update Carts",
      metadata: await updateCarts(req),
    }).send(res);
  };

  public static deleteCarts = async (req: RequestCustom, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Process Delete Carts",
      metadata: await deleteCarts(req.body),
    }).send(res);
  };

  public static getDetailCarts = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Process Get Detail Carts",
      metadata: await getDetailCarts(req),
    }).send(res);
  };

  public static getAllCarts = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Process Get All Carts",
      metadata: await getAllCarts(req.body),
    }).send(res);
  };
}

export default CartsController;
