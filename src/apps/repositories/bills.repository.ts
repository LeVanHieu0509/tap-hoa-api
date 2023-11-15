import { EntityRepository, Repository } from "typeorm";
import { Bills } from "../modules/entities/bills.entity";

@EntityRepository(Bills)
export class BillsRepository extends Repository<Bills> {}
