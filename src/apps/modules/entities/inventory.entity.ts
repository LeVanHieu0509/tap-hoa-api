import { Field, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import Products from "./product.entity";

@ObjectType()
@Entity()
export class Inventories {
  @Field((_type) => Number)
  @PrimaryGeneratedColumn()
  public id!: number;

  @Field()
  @Column({ type: "varchar" })
  public inven_location?: string;

  @Field()
  @Column({ type: "int", nullable: true })
  public inven_stock!: number;

  @Field()
  @Column({ type: "varchar", nullable: true })
  public inven_reservations?: string;

  @Field()
  @CreateDateColumn()
  public createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  public updatedAt!: Date;

  @Field((_type) => Products)
  @ManyToOne(() => Products, (products) => products.inventories, {
    cascade: true,
  })
  @JoinColumn({ name: "product_id" })
  public products?: Products;
}
export default Inventories;
