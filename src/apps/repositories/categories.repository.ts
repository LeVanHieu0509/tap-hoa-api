import { EntityRepository, Repository } from "typeorm";
import Categories from "../modules/entities/categories";

@EntityRepository(Categories)
export class CategoriesRepository extends Repository<Categories> {}
