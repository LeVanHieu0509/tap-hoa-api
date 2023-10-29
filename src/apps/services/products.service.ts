import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/users.repository";

const findProducts = async ({
  usr_name,
  select = { email: 1, password: 2, name: 1, status: 1, role: 1 },
}: {
  usr_name: string;
  select?: any;
}) => {
  //   const userRepository = getCustomRepository(ProductRe);
  //   return await userRepository.findOne({ usr_name });

  return {
    product: 1243,
  };
};

export { findProducts };
