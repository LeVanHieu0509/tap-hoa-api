import { Response, Request, NextFunction } from "express";
import { SuccessResponse } from "../../../core/success.response";
import UserService from "../../services/user";

class UserController {
  constructor(parameters) {}

  public static insert = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      new SuccessResponse({
        message: "Logout Success",
        statusCode: 200,
        metadata: await UserService.insert(req.body),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
