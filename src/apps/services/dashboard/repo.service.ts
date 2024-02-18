import { sortBy } from "lodash";
import moment, { Moment } from "moment";
import { getCustomRepository } from "typeorm";
import { BillsRepository } from "../../repositories/bills.repository";
import { ProductsRepository } from "../../repositories/products.reposiotory";
// fixed just for testing, use moment();

function isToday(momentDate: any) {
  return momentDate.isSame(moment().clone().startOf("day"), "d");
}

function isCheckDateInCurrentMonth(date: Moment) {
  const currentDate = moment(); // Get the current date
  const currentMonth = currentDate.month(); // Get the current month (0-indexed)
  const currentYear = currentDate.year(); // Get the current year

  const targetMonth = date.month(); // Get the month of the target date
  const targetYear = date.year(); // Get the year of the target date

  return currentMonth === targetMonth && currentYear === targetYear;
}

function totalSumPriceRevenue(products) {
  return products.reduce((sum, bill) => sum + bill.total_price, 0);
}

function totalSumPriceProfit(products) {
  let totalProfit = 0;

  products.forEach((item) => {
    return JSON.parse(item.cart_products).forEach((element) => {
      totalProfit =
        totalProfit + (element.product_price_sell - element.product_price_origin) * element.product_quantity_order;
    });
  });

  return totalProfit;
}

function totalSumQuantity(products) {
  let total = 0;
  products.forEach((item) => {
    return JSON.parse(item.cart_products).forEach((element) => {
      total = total + element.product_quantity_order;
    });
  });

  return total;
}

export const totalMoneyOverview = async () => {
  const billsRepository = getCustomRepository(BillsRepository);
  const queryBuilderBills = billsRepository.createQueryBuilder("bills");

  const productRepository = getCustomRepository(ProductsRepository);
  const queryBuilderProduct = productRepository.createQueryBuilder("products");

  queryBuilderBills.select(["bills.total_price", "bills.cart_products", "bills.createdAt"]);

  // Execute query and count total records
  const [bills, total] = await queryBuilderBills.getManyAndCount();
  const [products, quantityProduct] = await queryBuilderProduct.getManyAndCount();

  let listProductsOrder = {};
  let billToday = bills.filter((item) => isToday(moment(item.createdAt, "YYYY-MM-DD")));
  let billInMonth = bills.filter((item) => isCheckDateInCurrentMonth(moment(item.createdAt, "YYYY-MM-DD")));

  let overview = {
    revenue: {
      totalToday: totalSumPriceRevenue(billToday),
      totalMonth: totalSumPriceRevenue(billInMonth),
    },
    profit: {
      totalToday: totalSumPriceProfit(billToday),
      totalMonth: totalSumPriceProfit(billInMonth),
    },
    bills: {
      totalToday: billToday.length,
      totalMonth: billInMonth.length,
    },
    product: {
      totalToday: totalSumQuantity(billToday),
      totalMonth: totalSumQuantity(billInMonth),
    },
  };

  bills.forEach((item) => {
    return JSON.parse(item.cart_products).forEach((element) => {
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
    overview,
    totalProfit: totalSumPriceProfit(bills),
    totalRevenue: bills.reduce((sum, bill) => sum + bill.total_price, 0),
    quantityBills: total,
    quantityProduct,
    listAllProduct: sortBy(mapObject, "product_quantity_order")
      .slice(mapObject.length - 5, mapObject.length)
      .reverse(),
  };
};
