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
import Users from "./users.entity";

@ObjectType()
@Entity({
  engine: "InnoDB",
  schema: "utf8mb4_bin",
  synchronize: true,
})
export class Keys {
  @Field((_type) => Number)
  @PrimaryGeneratedColumn()
  public id!: number;

  @Field((_type) => String)
  @Column({ type: "varchar", nullable: true })
  public publicKey!: string;

  @Field((_type) => String)
  @Column({ type: "varchar", nullable: true })
  public privateKey!: string;

  @Field((_type) => String)
  @Column({ type: "varchar", nullable: true })
  public refreshToken!: string;

  @Field((_type) => String)
  @Column({ type: "simple-array", nullable: true })
  public refreshTokensUsed!: string[]; //đã được sử dụng

  @Field()
  @Column()
  @CreateDateColumn()
  public createdAt!: Date;

  @Field()
  @Column()
  @UpdateDateColumn()
  public updatedAt!: Date;

  @Field((_type) => Users)
  @ManyToOne((_type) => Users, (users: Users) => users.keys, {
    primary: true,
  })
  @JoinColumn({ name: "usr_id" })
  public usr_id!: Users;
}
