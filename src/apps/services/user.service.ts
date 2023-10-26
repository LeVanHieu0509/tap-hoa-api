import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/users.repository";

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

export { findByUsername };
