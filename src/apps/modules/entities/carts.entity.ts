import { Field, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import Users from "./users.entity";
import { Bills } from "./bills.entity";

@ObjectType()
@Entity()
// @Unique(["cart_code"])
export class Carts {
  @Field((_type) => Number)
  @PrimaryGeneratedColumn()
  public id!: number;

  @Field((_type) => Users)
  @ManyToOne((_type) => Users, (users: Users) => users.cart, {
    primary: true,
  })
  @JoinColumn({ name: "usr_id" })
  public user!: Users;

  @Field()
  @Column({ type: "varchar", nullable: true, unique: true })
  public cart_code!: string;

  @Field((_type) => String)
  @Column({ type: "varchar", nullable: true })
  public cart_state!: string;

  @Field((_type) => String)
  @Column({ type: "text", nullable: true })
  public cart_products!: string; //array

  @Field((_type) => String)
  @Column({ type: "int", default: 0 })
  public cart_count_product!: number;

  @Field()
  @Column()
  @CreateDateColumn()
  public createdAt!: Date;

  @Field()
  @Column()
  @UpdateDateColumn()
  public updatedAt!: Date;

  @Field((_type) => [Bills])
  @OneToMany((_type) => Bills, (key: Bills) => key.cart)
  public cart!: Bills[];
}
