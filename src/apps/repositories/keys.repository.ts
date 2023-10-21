import { EntityRepository, Repository } from "typeorm";
import { Keys } from "../modules/entities/keys.entity";

@EntityRepository(Keys)
export class KeysRepository extends Repository<Keys> {}
