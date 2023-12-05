import slugify from "slugify";
import { Field, ObjectType } from "type-graphql";
import { Service } from "typedi";
import {
  BeforeInsert,
  BeforeUpdate,
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
import Categories from "./categories";
import Inventories from "./inventory.entity";

@ObjectType()
class SlugtifiedProductName {
  @Field(() => String)
  product_slug: string;
}

@Service()
@Entity()
@ObjectType()
@Unique(["product_code", "product_bar_code"])
export class Products {
  @Field((_type) => Number)
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @Field()
  @Column({ type: "varchar", nullable: true, unique: true })
  public product_code!: string;

  @Field()
  @Column({ type: "varchar", nullable: true })
  public product_bar_code!: string;

  @Field()
  @Column({ type: "nvarchar", nullable: true })
  public product_name!: string;

  @Field()
  @Column({ type: "text", nullable: true })
  public product_description!: string;

  @Field()
  @Column({ type: "varchar", nullable: true })
  public product_image_url: string;

  @Field()
  @Column({ type: "float", nullable: true })
  public product_price_origin!: number;

  @Field()
  @Column({ type: "float", nullable: true })
  public product_price_sell!: number;

  @Field((type) => SlugtifiedProductName)
  @Column({ type: "varchar", nullable: true })
  public product_slug?: string;

  @BeforeInsert()
  @BeforeUpdate()
  async slugtifyProductName() {
    // slugify from product name
    this.product_slug = this.product_name ? slugify(this.product_name, { lower: true }) : null;
  }

  @Field()
  @Column({ type: "int", nullable: true })
  public product_quantity!: number;

  @Field()
  @Column({ type: "smallint", default: 0 })
  public is_draft!: boolean;

  @Field()
  @Column({ type: "smallint", default: 0 })
  public is_gen_product_bar_code!: number;

  @Field()
  @Column({ type: "smallint", default: 1 })
  public is_published!: boolean;

  @Field()
  @Column({ type: "date", nullable: true })
  public product_manufacture_date?: Date;

  @Field()
  @Column({ type: "date", nullable: true })
  public product_expired_date?: Date;

  @Field()
  @Column()
  @CreateDateColumn()
  public createdAt!: Date;

  @Field()
  @Column()
  @UpdateDateColumn()
  public updatedAt!: Date;

  @Field((_type) => Categories)
  @ManyToOne(() => Categories, (categories) => categories.products, {
    cascade: true,
  })
  @JoinColumn({ name: "category_id" })
  public categories!: Categories;

  @Field((_type) => [Inventories])
  @OneToMany((_type) => Inventories, (inventories: Inventories) => inventories.products)
  public inventories!: Inventories[];
}

export default Products;
