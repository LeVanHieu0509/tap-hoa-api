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

@ObjectType()
@Entity({
  engine: "InnoDB",
  schema: "utf8mb4_bin",
  synchronize: true,
})
@Unique(["usr_id"])
@Index("idx_email_age_name", ["usr_email", "usr_age", "usr_name"])
@Index("idx_status", ["usr_status"])

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
  @Column({ type: "int", nullable: true, default: "0" })
  public usr_age!: number;

  @Field()
  @Column({ type: "varchar", nullable: true, collation: "utf8mb4_bin" })
  @Length(0, 128)
  public usr_name!: string;

  @Field()
  @Column({ type: "int", nullable: true, default: "0" })
  public usr_status!: number;

  @Field()
  @Column({ type: "varchar", nullable: true, collation: "utf8mb4_bin" })
  @Length(0, 128)
  public usr_address!: string;

  @Field()
  @UpdateDateColumn()
  public updatedAt!: Date;

  @Field()
  @CreateDateColumn()
  public createdAt!: Date;

  @Field((_type) => [Keys])
  @OneToMany((_type) => Keys, (key: Keys) => key.usr_id)
  public keys!: Keys[];
}
export default Users;
