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
import { Carts } from "./carts.entity";

@ObjectType()
@Entity()
export class Bills {
  @Field((_type) => Number)
  @PrimaryGeneratedColumn()
  public id!: number;

  @Field((_type) => Number)
  @Column({ type: "float", nullable: true })
  public total_price!: number;

  @Field((_type) => Number)
  @Column({ type: "float", nullable: true })
  public total_customer_price!: number;

  @Field((_type) => Number)
  @Column({ type: "float", nullable: true })
  public total_refund_price!: number;

  @Field((_type) => String)
  @Column({ type: "varchar", nullable: true })
  public status!: string;

  @Field((_type) => String)
  @Column({ type: "varchar", nullable: true })
  public cart_products!: string; //array

  @Field()
  @Column()
  @CreateDateColumn()
  public createdAt!: Date;

  @Field()
  @Column()
  @UpdateDateColumn()
  public updatedAt!: Date;

  @Field((_type) => Carts)
  @ManyToOne((_type) => Carts, (users: Carts) => users.cart, {
    primary: true,
  })
  @JoinColumn({ name: "cart_id" })
  public cart!: Carts;
}
