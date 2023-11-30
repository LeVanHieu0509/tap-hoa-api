import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity({
  engine: "InnoDB",
  schema: "utf8mb4_bin",
  synchronize: true,
})
export class ApiKey {
  @Field((_type) => Number)
  @PrimaryGeneratedColumn({ type: "int" })
  public id!: number;

  @Field((_type) => String)
  @Column({ type: "varchar", nullable: true })
  public key!: string;

  @Field((_type) => String)
  @Column({ type: "bit", nullable: true })
  public status!: string;

  @Field((_type) => String)
  @Column({ type: "simple-array", nullable: true })
  public permissions!: string[];

  @Field()
  @Column()
  @CreateDateColumn()
  public createdAt!: Date;

  @Field()
  @Column()
  @UpdateDateColumn()
  public updatedAt!: Date;
}
