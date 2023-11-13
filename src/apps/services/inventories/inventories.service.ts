// Dữ liệu tồn kho, lưu trữ thông tin về số lượng tồn kho của sản phẩm.
// Theo dõi và quản lý hàng tồn kho, nhằm đảm bảo răng là product luôn có sản phẩm để bán
// Truy vấn hiệu quả hơn

import { getCustomRepository } from "typeorm";
import { InventoriesRepository } from "../../repositories/inventories.repository";
import { getProductByProductCode } from "../product/repo.service";
import { BadRequestError } from "../../../core/error.response";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import Inventories from "../../modules/entities/inventory.entity";

// Có sản phẩm rồi mới cho đặt hàng, cũng như là thanh toán rồi mới cho đặt hàng.
export const addStockToInventory = async (req) => {
  const { stock, product_code, location = "123 abc xyz" } = req;

  const inventoriesRepository = getCustomRepository(InventoriesRepository);

  const product = await getProductByProductCode({ product_code });

  if (!product) throw new BadRequestError("The product does not exists");

  const updateSet: QueryDeepPartialEntity<Inventories> = {
    inven_location: location,
    inven_stock: stock,
  };

  return await inventoriesRepository.update(
    {
      products: product_code,
    },
    updateSet
  );
};

export const insertInventory = async ({ product_code, stock, location }) => {
  const inventoriesRepository = getCustomRepository(InventoriesRepository);

  const inventory = await inventoriesRepository.create({
    products: product_code,
    inven_stock: stock,
    inven_location: location,
  }); //this là những tham số ở trong contructor

  return await inventoriesRepository.save(inventory);
};
