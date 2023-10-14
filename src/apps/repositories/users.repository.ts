import { EntityRepository, Repository } from "typeorm";
import Users from "../modules/entities/users.entity";

@EntityRepository(Users)
export class UsersRepository extends Repository<Users> {}
