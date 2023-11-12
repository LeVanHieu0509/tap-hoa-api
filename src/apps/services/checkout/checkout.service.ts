import { getCustomRepository } from "typeorm";
import { BadRequestError } from "../../../core/error.response";
import { HEADER } from "../../auth/authUtils";
import { ProductsRepository } from "../../repositories/products.reposiotory";
import { findCartById } from "../carts/repo.service";
import { getProductByCode } from "../product/repo.service";
import { CartsRepository } from "../../repositories/carts.repository";

export const checkoutReview = async (req) => {
  const { id } = req.body;

  const foundCarts = await findCartById({ id });
  if (!foundCarts) throw new BadRequestError("Không tìm thấy carts nào!");

  const checkout_order = {
    totalQuantity: 0, // tong tien hang
    totalPrice: 0, //tong thanh toan
  };

  const cartProducts = JSON.parse((await foundCarts).cart_products);
  const newCartsProduct = [];

  for (let i = 0; i < cartProducts.length; i++) {
    let { product_code, quantity } = cartProducts[i];

    const foundProduct = await getProductByCode({ product_code });

    const product = {
      id: foundProduct.id,
      product_code: foundProduct.product_code,
      product_name: foundProduct.product_name,
      product_price_sell: foundProduct.product_price_sell,
      product_quantity_order: quantity,
      product_total_price: foundProduct.product_price_sell * quantity,
    };

    checkout_order.totalPrice = checkout_order.totalPrice + product.product_total_price;
    checkout_order.totalQuantity = checkout_order.totalQuantity + quantity;

    newCartsProduct.push(product);
  }
  //tra ve data de xuat file pdf
  return {
    cartProducts: newCartsProduct,
    ...checkout_order,
  };
};

export const orderByUser = async (req) => {
  const { id, user_address, user_payment } = req.body ?? {};

  const productRepository = getCustomRepository(ProductsRepository);
  const cartRepository = getCustomRepository(CartsRepository);

  const foundCarts = await findCartById({ id: id });

  if (!foundCarts) throw new BadRequestError("Không tìm thấy cart nào!");

  if (foundCarts.cart_state !== "active") throw new BadRequestError("Bạn đã xác nhận đơn này rồi, vui lòng thử lại!");

  const cartProducts = JSON.parse(foundCarts.cart_products);

  for (let i = 0; i < cartProducts.length; i++) {
    const { product_code, quantity } = cartProducts[i];

    const foundProduct = getProductByCode({ product_code });

    await productRepository.update(
      {
        product_code,
      },
      {
        product_quantity: (await foundProduct).product_quantity - quantity,
      }
    );

    await cartRepository.update(
      {
        id,
      },
      {
        cart_state: "success",
      }
    );
  }

  return {
    status: "1",
    message: "Bạn đã xác nhận đơn thành công!",
  };
};
