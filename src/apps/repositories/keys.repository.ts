import { EntityRepository, Repository } from "typeorm";
import { Keys } from "apps/modules/entities/keys.entity";

@EntityRepository(Keys)
export class KeysRepository extends Repository<Keys> {}
