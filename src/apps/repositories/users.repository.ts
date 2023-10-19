import Users from "apps/modules/entities/users.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Users)
export class UsersRepository extends Repository<Users> {}
