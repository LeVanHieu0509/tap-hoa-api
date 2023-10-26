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
export class LoginHistories {
  @Field((_type) => Number)
  @PrimaryGeneratedColumn()
  public id!: number;

  @Field((_type) => String)
  @Column({ type: "varchar", nullable: true })
  public usr_name!: string;

  @Field((_type) => Date)
  @Column({ type: "datetime", nullable: true })
  public loginTime!: string;

  @Field((_type) => Date)
  @Column({ type: "datetime", nullable: true })
  public logoutTime!: string;

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
