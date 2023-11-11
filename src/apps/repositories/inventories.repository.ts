import { EntityRepository, Repository } from "typeorm";
import Inventories from "../modules/entities/inventory.entity";

@EntityRepository(Inventories)
export class InventoriesRepository extends Repository<Inventories> {}
