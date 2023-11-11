import { EntityRepository, Repository } from "typeorm";
import { Carts } from "../modules/entities/carts.entity";

@EntityRepository(Carts)
export class CartsRepository extends Repository<Carts> {}
