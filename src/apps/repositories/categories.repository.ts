import { EntityRepository, Repository } from "typeorm";
import Categories from "../modules/entities/product.entity";

@EntityRepository(Categories)
export class CategoriesRepository extends Repository<Categories> {}
