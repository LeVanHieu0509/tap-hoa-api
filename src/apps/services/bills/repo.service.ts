import { getCustomRepository } from "typeorm";
import { BillsRepository } from "../../repositories/bills.repository";

export const findBillsByUser = async ({ cart_id }) => {
  const billsRepository = getCustomRepository(BillsRepository);

  const bills = await billsRepository.findOne({
    cart: cart_id,
  });

  return bills;
};

export const findBillsById = async ({ id }) => {
  const billsRepository = getCustomRepository(BillsRepository);

  const foundBill = await billsRepository.findOne({
    id,
  });

  return foundBill;
};

export const findAllBills = async ({ limit, sortOrder, sortBy, page, filter, select }: any) => {
  const billsRepository = getCustomRepository(BillsRepository);
  const queryBuilder = billsRepository.createQueryBuilder("bills");

  //query toi bang categories
  queryBuilder.leftJoinAndSelect("bills.cart", "cart");

  // Sort by column and order
  if (sortBy && sortOrder) {
    queryBuilder.orderBy(`bills.${sortBy}`, sortOrder.toUpperCase());
  }
  // Select specific columns
  if (select) {
    let selectFileds = select.map((item) => {
      return `bills.${item}`;
    });
    queryBuilder.select(selectFileds);
  }

  if (filter) {
    let { cart_id, usr_id } = filter ?? {};

    if (cart_id) {
      queryBuilder.andWhere("bills.cart_id = :cart_id", { cart_id: filter.cart_id });
    }
    if (usr_id) {
      queryBuilder.andWhere("bills.usr_id = :usr_id", { usr_id: filter.usr_id });
    }
  }

  // Limit and offset
  const skip = (page - 1) * limit;

  queryBuilder.skip(skip).take(limit);

  // Execute query and count total records
  const [products, total] = await queryBuilder.getManyAndCount();

  return { products, total };
};
