import { Length } from "class-validator";
import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Products from "./product.entity";

@ObjectType()
@Entity()
export class Categories {
  @Field((_type) => Number)
  @PrimaryGeneratedColumn()
  public id!: number;

  @Field()
  @Column({ type: "varchar" })
  @Length(0, 100)
  public title!: string;

  @Field()
  @Column({ type: "varchar" })
  @Length(4, 100)
  public image!: string;

  @Field()
  @CreateDateColumn()
  public createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  public updatedAt!: Date;

  @Field((_type) => [Products])
  @OneToMany((_type) => Products, (products: Products) => products.categories)
  public products!: Products[];
}
export default Categories;
