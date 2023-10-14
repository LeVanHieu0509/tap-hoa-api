import { getCustomRepository, getRepository } from "typeorm";
import User from "../../modules/entities/users.entity";
import { UsersRepository } from "../../repositories/users.repository";
class UserService {
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

    await usersRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(values)
      .execute();
  };
}

export default UserService;
