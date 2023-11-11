import { EntityRepository, Repository } from "typeorm";
import Products from "../modules/entities/product.entity";

@EntityRepository(Products)
export class ProductsRepository extends Repository<Products> {}
