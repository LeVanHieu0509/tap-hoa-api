import bcrypt from "bcrypt";
import _ from "lodash";
import crypto from "node:crypto";
import { getCustomRepository } from "typeorm";
import { AuthFailureError, BadRequestError, InternalServer, NotFoundError } from "../../core/error.response";
import { verifyJwt, verifyRefreshToken } from "../../utils/auth";
import { HEADER, createTokenPair } from "../auth/authUtils";
import User from "../modules/entities/users.entity";
import { UsersRepository } from "../repositories/users.repository";
import KeyTokenService from "./keyToken.service";
import { findAllUsers, findByUsername, findUserById, resetPassword } from "./user.service";
import client from "../../dbs/init.redis";
import {
  MESSAGE_DELETE_SUCCESS,
  MESSAGE_FAILED,
  MESSAGE_GET_SUCCESS,
  MESSAGE_NOTFOUND,
  MESSAGE_RESET_SUCCESS,
  MESSAGE_SUCCESS,
  MESSAGE_UPDATE_FAILED,
  MESSAGE_UPDATE_SUCCESS,
} from "../constants";
import { responseClient } from "../../utils";

const RoleUser = {
  USER: "USER",
  ADMINIE: "ADMINIE",
  EMPLOYEE: "EMPLOYEE",
};

class AuthService {
  constructor(parameters) {}

  public static insert = async ({ batchSize, totalSize }) => {
    return 1;
  };

  static insertBatch = async (batchSize = 10, totalSize = 1000) => {
    let currentId = 1;
    let values = [];
    const usersRepository = getCustomRepository(UsersRepository);

    for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
      const username = `username-${currentId}`;
      const email = `email-${currentId}`;
      const password = `password-${currentId}`;
      const role = `role-${currentId}`;

      values.push([username, email, password, role]);
    }

    await usersRepository.createQueryBuilder().insert().into(User).values(values).execute();
  };

  public static login = async ({ usr_name, usr_pass, refreshToken }: any) => {
    //Mỗi user khi login đều đã có 2 key là privateKey và publicKey
    // privateKey là key scret của AccessToken
    const userRepository = getCustomRepository(UsersRepository);

    const foundUser = await findByUsername({ usr_name });
    if (!foundUser)
      return responseClient({ status: "-1", message: "Tài khoản của bạn chưa chính xác, vui lòng thử lại!" });

    const match = await bcrypt.compare(usr_pass, foundUser.usr_pass);

    //lock account
    if (!match && foundUser.usr_lock_count === 5) {
      await userRepository.update({ usr_id: foundUser.usr_id }, { usr_blocked: true, usr_lock_time: new Date() });

      return responseClient({
        status: "-1",
        message: "Tài khoản của bạn đã bị khoá, vui lòng liên hệ admin để xử lý!",
      });
    }

    if (!match) return responseClient({ status: "-1", message: "Mật khẩu của bạn chưa chính xác, vui lòng thử lại!" });

    const { publicKey, privateKey } = await KeyTokenService.getKeyStoreByUserId({ usr_id: foundUser.usr_id });

    const tokens = await createTokenPair({ usr_id: foundUser.usr_id }, publicKey, privateKey);

    return responseClient({
      status: "1",
      data: {
        user: _.omit(foundUser, ["usr_pass"]),
        tokens,
      },
      message: MESSAGE_SUCCESS,
    });
  };

  public static signUp = async ({ usr_name, usr_email, password, roles }: any) => {
    //1. Check account exits
    const userRepository = getCustomRepository(UsersRepository);
    const user = await userRepository.findOne({ usr_name });

    if (user) {
      return responseClient({
        message: "Tài khoản này đã tồn tại trên hệ thống",
        status: "-1",
      });
    }
    //2. Hash Pass
    const passwordHash = await bcrypt.hash(password, 10);

    //3. Luu database
    const newUser = userRepository.create({
      usr_name: usr_name,
      usr_pass: passwordHash,
      usr_email: usr_email,
      usr_roles: roles ?? RoleUser.EMPLOYEE,
    });

    await userRepository.save(newUser);

    //4. tao moi privateKey, publicKey
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    //5. save key to kayStore
    const keyStore = KeyTokenService.createKeyToken({
      usr_id: newUser.usr_id,
      publicKey,
      privateKey,
    });

    if (!keyStore) {
      return responseClient({
        message: "KeyStore error",
        status: "-1",
      });
    }

    //6. Sinh ra token token pair
    const tokens = await createTokenPair(
      {
        usr_id: newUser.usr_id,
      },
      publicKey,
      privateKey
    );

    return responseClient({
      message: "Bạn đã tạo tài khoản thành công!",
      status: "1",
      data: {
        user: _.omit(newUser, ["usr_pass"]),
        tokens: tokens,
      },
    });
  };

  public static logout = async (req) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    const {
      body: { refreshToken },
    } = req;

    // Có tài khoản?
    // Có refreshToken?

    if (!refreshToken) throw new AuthFailureError("Resfresh Token Not Found");

    const keyToken = await KeyTokenService.getKeyStoreByUserId({ usr_id: userId });
    if (!keyToken) throw new NotFoundError("Not Found KeyToken");

    const decodeData: any = await verifyRefreshToken(refreshToken, keyToken.privateKey);

    return new Promise((resolve, reject) => {
      // client.del(`usr_id:${decodeData.usr_id.toString()}`, (err, reply) => {
      //   if (err) reject(err);
      //   if (reply == 1) {
      //     resolve({
      //       status: "1",
      //       message: "logout success",
      //     });
      resolve({
        status: "1",
        message: "logout success",
      });
    });
  };

  public static refreshToken = async (req, res, next) => {
    const {
      body: { refreshToken },
    } = req;

    const userId = req.headers[HEADER.CLIENT_ID];

    if (!refreshToken) throw new BadRequestError("refreshToken Not Found");
    if (!userId) throw new AuthFailureError("Không có quyền đăng nhập");

    const keyToken = await KeyTokenService.getKeyStoreByUserId({ usr_id: userId });
    if (!keyToken) throw new NotFoundError("Not Found KeyToken");

    const decodeUser: any = await verifyRefreshToken(refreshToken, keyToken.privateKey);

    if (Number(userId) !== decodeUser.usr_id) throw new AuthFailureError("Invalid User ID");

    const tokens = await createTokenPair(
      {
        usr_id: decodeUser.usr_id,
      },
      keyToken?.publicKey,
      keyToken.privateKey
    );

    if (tokens) {
      return responseClient({
        message: MESSAGE_SUCCESS,
        status: "1",
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      });
    } else {
      return responseClient({
        status: "-1",
        message: MESSAGE_NOTFOUND,
      });
    }
  };

  public static changePass = async ({ email, password }, userId) => {};

  public static deleteUser = async ({ usr_id }) => {
    const userRepository = getCustomRepository(UsersRepository);
    const foundProduct = await findUserById({ usr_id });

    if (foundProduct) {
      const deleteKey = await userRepository.delete({ usr_id });

      return responseClient({
        status: deleteKey.affected,
        message: MESSAGE_DELETE_SUCCESS,
      });
    } else {
      return responseClient({
        status: "-1",
        message: MESSAGE_NOTFOUND,
      });
    }
  };

  public static resetPass = async ({ usr_id, usr_pass, usr_name }) => {
    const foundUser = await findUserById({ usr_id });
    if (!foundUser) return responseClient({ status: "-1", message: MESSAGE_NOTFOUND });

    const result = await resetPassword({ usr_id, usr_pass, usr_name });

    if (result == 1) {
      return responseClient({ status: result, message: MESSAGE_RESET_SUCCESS });
    } else {
      return responseClient({
        status: result,
        message: MESSAGE_FAILED,
      });
    }
  };

  public static getUsers = async ({ limit, sortOrder, sortBy, page, filter = null, select = null }: any) => {
    const { users, total } = await findAllUsers({
      limit,
      sortOrder,
      sortBy,
      page,
      filter,
      select,
    });

    return responseClient({
      message: MESSAGE_GET_SUCCESS,
      status: "1",
      data: {
        users,
        total,
      },
    });
  };
}

export default AuthService;
