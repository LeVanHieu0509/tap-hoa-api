import bcrypt from "bcrypt";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/users.repository";
import { responseClient } from "../../utils";
import { MESSAGE_NOTFOUND, MESSAGE_UPDATE_SUCCESS } from "../constants";

const findByUsername = async ({
  usr_name,
  select = { email: 1, password: 2, name: 1, status: 1, role: 1 },
}: {
  usr_name: string;
  select?: any;
}) => {
  const userRepository = getCustomRepository(UsersRepository);
  return await userRepository.findOne({ usr_name });
};

const findUserById = async ({ usr_id }: { usr_id: number }) => {
  const userRepository = getCustomRepository(UsersRepository);
  return await userRepository.findOne({ usr_id });
};

const findAllUsers = async ({ limit, sortOrder, sortBy, page, select, filter }: any) => {
  const productRepository = getCustomRepository(UsersRepository);
  const queryBuilder = productRepository.createQueryBuilder("users");

  // Sort by column and order
  if (sortBy && sortOrder) {
    queryBuilder.orderBy(`users.${sortBy}`, sortOrder.toUpperCase());
  }
  // Select specific columns
  if (select) {
    let selectFileds = select.map((item) => {
      return `users.${item}`;
    });
    queryBuilder.select(selectFileds);
  }

  const skip = (page - 1) * limit;

  queryBuilder.skip(skip).take(limit);

  // Execute query and count total records
  const [users, total] = await queryBuilder.getManyAndCount();

  return { users, total };
};

const resetPassword = async ({ usr_id, usr_pass, usr_name }) => {
  const userRepository = getCustomRepository(UsersRepository);

  const passwordHash = await bcrypt.hash(usr_pass, 10);

  const result = await userRepository.update(
    {
      usr_id,
    },
    {
      usr_pass: passwordHash,
      usr_name: usr_name,
    }
  );

  return result.affected;
};

export { findByUsername, findUserById, findAllUsers, resetPassword };
