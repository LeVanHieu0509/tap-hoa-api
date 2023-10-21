import { getCustomRepository } from "typeorm";
import User from "../modules/entities/users.entity";
import { UsersRepository } from "../repositories/users.repository";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import KeyTokenService from "./keyToken.service";
import { createTokenPair } from "../auth/authUtils";
import _ from "lodash";

const RoleUser = {
  USER: "USER",
  ADMIN: "ADMIN",
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

  public static login = async ({ email, password, refreshToken }: any) => {};

  public static logout = async (keystore) => {};

  public static signUp = async ({ usr_name, usr_email, password, roles }: any) => {
    //1. Check account exits
    const userRepository = getCustomRepository(UsersRepository);
    const user = await userRepository.findOne({ usr_name });

    if (user) {
      return {
        message: "Tài khoản này đã tồn tại trên hệ thống",
        status: "-1",
      };
    }
    //2. Hash Pass
    const passwordHash = await bcrypt.hash(password, 10);

    //3. Luu database
    const newUser = userRepository.create({
      usr_name: usr_name,
      usr_pass: passwordHash,
      usr_email: usr_email,
      usr_roles: JSON.stringify([RoleUser.USER]),
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
      return {
        message: "KeyStore error",
        status: "404",
      };
    }

    //6. Sinh ra token token pair
    const tokens = await createTokenPair(
      {
        usr_id: newUser.usr_id,
        usr_email: newUser.usr_email,
      },
      privateKey,
      publicKey
    );

    return {
      message: "Tạo tài khoản thành công",
      status: "1",
      user: _.omit(newUser, ["usr_pass"]),
      tokens: tokens,
    };
  };

  public static changePass = async ({ email, password }, userId) => {};
}

export default AuthService;
