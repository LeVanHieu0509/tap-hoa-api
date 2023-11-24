import { NextFunction } from "express";

import { SuccessResponse } from "../../core/success.response";
import { getCategories } from "../services/categories/categories.service";

class CategoriesController {
  constructor(parameters) {}
  public static getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new SuccessResponse({
        message: "getCategories",
        statusCode: 200,
        metadata: await getCategories(),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

export default CategoriesController;
