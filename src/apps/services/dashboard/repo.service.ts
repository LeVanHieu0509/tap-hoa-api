import { getCustomRepository } from "typeorm";
import { BillsRepository } from "../../repositories/bills.repository";
import { ProductsRepository } from "../../repositories/products.reposiotory";
import { countBy, flattenDeep, sortBy } from "lodash";

export const totalMoneyOverview = async () => {
  const billsRepository = getCustomRepository(BillsRepository);
  const queryBuilderBills = billsRepository.createQueryBuilder("bills");

  const productRepository = getCustomRepository(ProductsRepository);
  const queryBuilderProduct = productRepository.createQueryBuilder("products");

  queryBuilderBills.select(["bills.total_price", "bills.cart_products", "bills.createdAt"]);

  // Execute query and count total records
  const [products, total] = await queryBuilderBills.getManyAndCount();
  const [a, quantityProduct] = await queryBuilderProduct.getManyAndCount();

  let listProductsOrder = {};
  let totalProfit = 0;

  products.forEach((item) => {
    return JSON.parse(item.cart_products).forEach((element) => {
      console.log(element);
      totalProfit =
        totalProfit + (element.product_price_sell - element.product_price_origin) * element.product_quantity_order;

      if (listProductsOrder[element.id]?.id && element.id == listProductsOrder[element.id].id) {
        listProductsOrder[element.id] = {
          ...element,
          product_quantity_order: listProductsOrder[element.id].product_quantity_order + element.product_quantity_order,
          product_total_price: listProductsOrder[element.id].product_total_price + element.product_total_price,
        };
      } else {
        listProductsOrder[element.id] = element;
      }
    });
  });

  const mapObject = Object.keys(listProductsOrder).map((item, index) => {
    return listProductsOrder[item];
  });

  return {
    totalProfit,
    totalRevenue: products.reduce((sum, bill) => sum + bill.total_price, 0),
    quantityBills: total,
    quantityProduct,
    listAllProduct: sortBy(mapObject, "product_quantity_order")
      .slice(mapObject.length - 5, mapObject.length)
      .reverse(),
  };
};
