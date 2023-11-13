import { getCustomRepository } from "typeorm";
import { ProductsRepository } from "../../repositories/products.reposiotory";

export const getProductByProductCode = async ({ product_code }) => {
  const productRepository = getCustomRepository(ProductsRepository);

  return await productRepository.findOne({ product_code });
};

export const getProductByProductBarCode = async ({ product_bar_code }) => {
  const productRepository = getCustomRepository(ProductsRepository);

  return await productRepository.findOne({ product_bar_code });
};

export const queryProduct = async ({ query, limit, skip }) => {
  const productRepository = getCustomRepository(ProductsRepository);

  return await productRepository.find({
    ...query,
    limit,
    skip,
  });
};

export const findAllProducts = async ({
  limit,
  sortOrder,
  sortBy,
  page,
  filter,
  select = [],
  priceMin,
  priceMax,
}: any) => {
  const productRepository = getCustomRepository(ProductsRepository);
  const queryBuilder = productRepository.createQueryBuilder("products");

  if (priceMin && priceMax) {
    queryBuilder.andWhere("products.product_price_sell BETWEEN :priceMin AND :priceMax", { priceMin, priceMax });
  } else if (priceMin) {
    queryBuilder.andWhere("products.product_price_sell >= :priceMin", { priceMin });
  } else if (priceMax) {
    queryBuilder.andWhere("products.product_price_sell <= :priceMax", { priceMax });
  }

  // Sort by column and order
  if (sortBy && sortOrder) {
    queryBuilder.orderBy(`products.${sortBy}`, sortOrder.toUpperCase());
  }
  // Select specific columns
  if (select) {
    let selectFileds = select.map((item) => {
      return `products.${item}`;
    });
    queryBuilder.select(selectFileds);
  }

  // Filter by isPublished
  if (filter) {
    let { is_published, product_code } = filter ?? {};
    if (product_code) {
      queryBuilder.andWhere("products.product_code = :product_code", { product_code: filter.product_code });
    }
    if (is_published) {
      queryBuilder.andWhere("products.is_published = :is_published", { is_published: filter.is_published });
    }
  }

  // Limit and offset
  const skip = (page - 1) * limit;

  queryBuilder.skip(skip).take(limit);

  // Execute query and count total records
  const [products, total] = await queryBuilder.getManyAndCount();

  return { products, total };
};
