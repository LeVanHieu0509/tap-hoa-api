import { NextFunction, Request, Response } from "express";
import { CREATED, SuccessResponse } from "../../core/success.response";
import { default as AuthService, default as UserService } from "../services/auth.service";

interface RequestCustom extends Request {
  keyStore: any;
}

class AuthController {
  constructor(parameters) {}

  public static insert = async (req: Request, res: Response, next: NextFunction) => {
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

  public static refreshToken = async (req: RequestCustom, res: Response, next: NextFunction) => {
    try {
      new SuccessResponse({
        message: "refreshToken Process!",
        metadata: await AuthService.refreshToken(req, res, next),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  public static login = async (req: RequestCustom, res: Response, next: NextFunction) => {
    try {
      new SuccessResponse({
        message: "Login Process!",
        metadata: await AuthService.login(req.body),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  public static logout = async (req: RequestCustom, res: Response, next: NextFunction) => {
    try {
      new SuccessResponse({
        message: "Logout Process!",
        metadata: await AuthService.logout(req.body),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  public static signUp = async (req: RequestCustom, res: Response, next: NextFunction) => {
    try {
      new CREATED({
        message: "SignUp Process!",
        metadata: await AuthService.signUp(req.body),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  public static changePass = async (req: RequestCustom, res: Response, next: NextFunction) => {};
}

export default AuthController;
