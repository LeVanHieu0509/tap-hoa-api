import { NextFunction } from "express";
import { signJwt, signRefreshToken, verifyJwt } from "../../utils/auth";
import { asyncHandler } from "../../helpers/asyncHandler";
import { AuthFailureError, BadRequestError, NotFoundError } from "../../core/error.response";
import KeyTokenService from "../services/keyToken.service";
import { findUserById } from "../services/user.service";

export const HEADER = {
  API_KEY: "user-api-key",
  CLIENT_ID: "user-client-id",
  AUTHORIZATION: "authorization",
  ROLES: "roles",
};

export interface RequestCustom extends Request {
  keyToken: any;
  user: any;
}

export const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = signJwt(payload, publicKey, {
      expiresIn: "30d",
    });

    const refreshToken = await signRefreshToken(payload, privateKey, {
      expiresIn: "1y",
    });

    verifyJwt(accessToken, publicKey);

    return { accessToken, refreshToken };
  } catch (e) {
    console.log("createTokenPair", e);
  }
};

export const authentication = asyncHandler(async (req: RequestCustom, res: Response, next: NextFunction) => {
  //1. Check user id missing???
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Không có quyền đăng nhập");

  //2. check keyStore with this user id

  const keyToken = await KeyTokenService.getKeyStoreByUserId({ usr_id: userId });
  if (!keyToken) throw new NotFoundError("Not Found KeyToken");

  //2. get accessToken
  const authHeader = req.headers[HEADER.AUTHORIZATION];
  const accessToken = authHeader.split(" ")[1];

  //3. verify token
  const decodeUser: any = verifyJwt(accessToken, keyToken.publicKey);

  if (!decodeUser) throw new AuthFailureError("Access Token Expired");
  //4. check user in dbs

  try {
    const user = await findUserById({ usr_id: decodeUser.usr_id });

    if (Number(userId) !== decodeUser.usr_id) throw new AuthFailureError("Invalid User ID");

    req.keyToken = keyToken;
    req.user = user;

    next();
  } catch (error) {
    throw error;
  }
  //6. ok all => return next()
});

export const routerPrivate = asyncHandler(async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers[HEADER.CLIENT_ID];
    const user = await findUserById({ usr_id: userId });

    if (user.usr_roles == "ADMINIE") {
      next();
    } else {
      throw new BadRequestError("Bạn không có quyền truy cập!");
    }
  } catch (error) {
    throw error;
  }
});
