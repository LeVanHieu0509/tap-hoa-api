import { NextFunction } from "express";
import { SuccessResponse } from "../../core/success.response";
import { addStockToInventory } from "../services/inventories/inventories.service";

class InventoriesController {
  constructor(parameters) {}

  public static addStockToInventory = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Create new Cart add stock to inventory success",
      metadata: await addStockToInventory(req.body),
    }).send(res);
  };
}

export default InventoriesController;
