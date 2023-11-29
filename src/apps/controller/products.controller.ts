import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "../../core/success.response";
import { responseClient } from "../../utils";
import { MESSAGE_NOTFOUND } from "../constants";
import {
  createProduct,
  deleteProduct,
  generalAutoProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../services/product/products.service";

class ProductsController {
  public static getProduct = async (req: Request, res: Response, next: NextFunction) => {
    return new SuccessResponse({
      metadata: await getProduct(req.body),
      statusCode: 200,
      message: "Process Get Product",
    }).send(res);
  };

  public static getProducts = async (req: Request, res: Response, next: NextFunction) => {
    return new SuccessResponse({
      metadata: await getProducts(req.body),
      statusCode: 200,
      message: "Process Get Products",
    }).send(res);
  };

  public static createProduct = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Process Create Product!",
      metadata: await createProduct(req.body),
    }).send(res);
  };

  public static deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Process Delete Product!",
      metadata: await deleteProduct(req.body),
    }).send(res);
  };
  public static updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Process Update Product!",
      metadata: await updateProduct(req.body),
    }).send(res);
  };

  public static generalAutoProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new SuccessResponse({
        message: "Process generalAutoProduct!",
        metadata: await generalAutoProduct(req.body),
      }).send(res);
    } catch (error) {
      return res.json(
        responseClient({
          message: MESSAGE_NOTFOUND,
          status: "-1",
        })
      );
    }
  };

  public static getSearchProducts = (req: Request, res: Response, next: NextFunction) => {};
  public static publicProduct = (req: Request, res: Response, next: NextFunction) => {};
  public static unPublicProduct = (req: Request, res: Response, next: NextFunction) => {};
  public static getPublicProducts = (req: Request, res: Response, next: NextFunction) => {};
  public static getDraffProducts = (req: Request, res: Response, next: NextFunction) => {};
}

export default ProductsController;
