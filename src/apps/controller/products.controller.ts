import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "../../core/success.response";
import { findProducts } from "../services/products.service";

class ProductsController {
  constructor(parameters) {}

  public static getProducts = async (req: Request, res: Response, next: NextFunction) => {
    return new SuccessResponse({
      metadata: await findProducts(req.body),
      statusCode: 200,
      message: "Products Process",
    }).send(res);
  };

  public static getProduct = async (req: Request, res: Response, next: NextFunction) => {};
  public static createProduct = (req: Request, res: Response, next: NextFunction) => {};
  public static deleteProduct = (req: Request, res: Response, next: NextFunction) => {};
  public static updateProduct = (req: Request, res: Response, next: NextFunction) => {};

  public static getSearchProducts = (req: Request, res: Response, next: NextFunction) => {};
  public static publicProduct = (req: Request, res: Response, next: NextFunction) => {};
  public static unPublicProduct = (req: Request, res: Response, next: NextFunction) => {};
  public static getPublicProducts = (req: Request, res: Response, next: NextFunction) => {};
  public static getDraffProducts = (req: Request, res: Response, next: NextFunction) => {};
}

export default ProductsController;
