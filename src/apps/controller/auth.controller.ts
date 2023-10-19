import { Response, Request, NextFunction } from "express";
import { SuccessResponse } from "../../core/success.response";
import UserService from "../services/auth.service";

interface RequestCustom extends Request {
  keyStore: any;
}

class AuthController {
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

  public static login = async (
    req: RequestCustom,
    res: Response,
    next: NextFunction
  ) => {};

  public static logout = async (
    req: RequestCustom,
    res: Response,
    next: NextFunction
  ) => {};

  public static signUp = async (
    req: RequestCustom,
    res: Response,
    next: NextFunction
  ) => {};

  public static changePass = async (
    req: RequestCustom,
    res: Response,
    next: NextFunction
  ) => {};
}

export default AuthController;
