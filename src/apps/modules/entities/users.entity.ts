import { Length } from "class-validator";
import { Field, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { Keys } from "./keys.entity";
import { Carts } from "./carts.entity";
import { Bills } from "./bills.entity";

@ObjectType()
@Entity({
  engine: "InnoDB",
  schema: "utf8mb4_bin",
  synchronize: true,
})
@Unique(["usr_id"])
// @Index("idx_email_age_name", ["usr_email", "usr_age", "usr_name"])
// @Index("idx_status", ["usr_status"])

//
export class Users {
  @Field((_type) => Number)
  @PrimaryGeneratedColumn({ type: "int" })
  public usr_id!: number;

  @Field()
  @Column({ type: "varchar", nullable: true, collation: "utf8mb4_bin" })
  @Length(0, 128)
  public usr_email!: string;

  @Field()
  @Column({ type: "int", nullable: true })
  public usr_age!: number;

  @Field()
  @Column({ type: "varchar", nullable: true, collation: "utf8mb4_bin" })
  @Length(0, 128)
  public usr_name!: string;

  @Field()
  @Column({ type: "int", nullable: true, default: "1" })
  public usr_status!: number;

  @Field()
  @Column({ type: "varchar", nullable: true, collation: "utf8mb4_bin" })
  @Length(0, 128)
  public usr_address!: string;

  @Field((_type) => String)
  @Column({ type: "varchar", nullable: true })
  public usr_roles!: string;

  @Field()
  @Column({ type: "varchar", nullable: true })
  public usr_pass!: string;

  @Field()
  @Column({ type: "varchar", nullable: true })
  public usr_phone!: string;

  @Field()
  @Column({ type: "bit", nullable: true })
  public usr_blocked?: boolean;

  @Field()
  @Column({ type: "int", nullable: true })
  public usr_lock_count!: number;

  @Field()
  @Column({ type: "datetime", nullable: true })
  public usr_lock_time!: Date;

  @Field()
  @Column({ type: "int", nullable: true })
  public usr_reset_password!: number;

  @Field()
  @Column({ type: "smallint", nullable: true })
  public usr_migration!: number;

  @Field()
  @UpdateDateColumn()
  public updatedAt!: Date;

  @Field()
  @CreateDateColumn()
  public createdAt!: Date;

  @Field((_type) => [Keys])
  @OneToMany((_type) => Keys, (key: Keys) => key.usr_id)
  public keys!: Keys[];

  @Field((_type) => [Carts])
  @OneToMany((_type) => Carts, (key: Carts) => key.user)
  public cart!: Carts[];

  @Field((_type) => [Bills])
  @OneToMany((_type) => Bills, (key: Bills) => key.user)
  public bill!: Bills[];
}
export default Users;
