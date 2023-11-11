import { getCustomRepository } from "typeorm";
import { CartsRepository } from "../../repositories/carts.repository";

export const findCartByUser = async ({ usr_id }) => {
  const cartRepository = getCustomRepository(CartsRepository);

  const userCart = await cartRepository.findOne({
    usr_id,
  });

  return userCart;
};

export const findCartById = async ({ id }) => {
  const cartRepository = getCustomRepository(CartsRepository);

  const userCart = await cartRepository.findOne({
    id,
  });

  return userCart;
};

export const findAllCarts = async ({ limit, sortOrder, sortBy, page, filter, select = [] }: any) => {
  const productRepository = getCustomRepository(CartsRepository);
  const queryBuilder = productRepository.createQueryBuilder("carts");

  // Sort by column and order
  if (sortBy && sortOrder) {
    queryBuilder.orderBy(`carts.${sortBy}`, sortOrder.toUpperCase());
  }
  // Select specific columns
  if (select) {
    let selectFileds = select.map((item) => {
      return `carts.${item}`;
    });
    queryBuilder.select(selectFileds);
  }

  // Filter by isPublished
  if (filter) {
    let { cart_state, usr_id } = filter ?? {};
    if (cart_state) {
      queryBuilder.andWhere("carts.cart_state = :cart_state", { cart_state: filter.cart_state });
    }
    if (usr_id) {
      queryBuilder.andWhere("carts.usr_id = :usr_id", { usr_id: filter.usr_id });
    }
  }

  // Limit and offset
  const skip = (page - 1) * limit;

  queryBuilder.skip(skip).take(limit);

  // Execute query and count total records
  const [products, total] = await queryBuilder.getManyAndCount();

  return { products, total };
};
