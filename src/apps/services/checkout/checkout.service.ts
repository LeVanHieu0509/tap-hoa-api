import { getCustomRepository } from "typeorm";
import { AuthFailureError, BadRequestError } from "../../../core/error.response";
import { responseClient } from "../../../utils";
import { MESSAGE_NOTFOUND, MESSAGE_SUCCESS } from "../../constants";
import { CartsRepository } from "../../repositories/carts.repository";
import { ProductsRepository } from "../../repositories/products.reposiotory";
import { findCartByCartCode, findCartById } from "../carts/repo.service";
import { getProductByProductCode } from "../product/repo.service";
import { insertBill } from "../bills/bills.service";
import { HEADER } from "../../auth/authUtils";

export const checkOrder = async ({ foundCarts }) => {
  if (!foundCarts) throw new BadRequestError("Không tìm thấy carts nào!");

  const checkout_order = {
    totalQuantity: 0, // tong tien hang
    totalPrice: 0, //tong thanh toan
  };

  const cartProducts = JSON.parse((await foundCarts).cart_products);
  const newCartsProduct = [];

  for (let i = 0; i < cartProducts.length; i++) {
    let { product_code, product_quantity } = cartProducts[i];
    const foundProduct = await getProductByProductCode({ product_code });

    const product = {
      id: foundProduct.id,
      product_code: foundProduct.product_code,
      product_name: foundProduct.product_name,
      product_price_sell: foundProduct.product_price_sell,
      product_price_origin: foundProduct.product_price_origin,
      product_quantity_order: product_quantity,
      product_total_price: foundProduct.product_price_sell * product_quantity,
    };

    checkout_order.totalPrice = checkout_order.totalPrice + product.product_total_price;
    checkout_order.totalQuantity = checkout_order.totalQuantity + product_quantity;

    newCartsProduct.push(product);
  }

  return {
    cartProducts: newCartsProduct,
    totalQuantity: checkout_order.totalQuantity, // tong tien hang
    totalPrice: checkout_order.totalPrice,
  };
};

export const checkoutReview = async (req) => {
  const { id, cart_code } = req ?? {};
  let ordersUser;

  if (id) {
    const foundCarts = await findCartById({ id });
    ordersUser = await checkOrder({ foundCarts });
  }
  if (cart_code) {
    const foundCarts = await findCartByCartCode({ cart_code });
    ordersUser = await checkOrder({ foundCarts });
  }

  //tra ve data de xuat file pdf
  return responseClient({
    status: "1",
    message: MESSAGE_SUCCESS,
    data: {
      cartProducts: ordersUser.cartProducts,
      totalQuantity: ordersUser.totalQuantity, // tong tien hang
      totalPrice: ordersUser.totalPrice,
    },
  });
};

const checkValidProducts = async (list) => {
  const listOutOfStock = [];

  for (let i = 0; i < list.length; i++) {
    const { product_code, product_quantity } = list[i];
    const foundProduct = getProductByProductCode({ product_code });

    if ((await foundProduct).product_quantity - product_quantity < 0) {
      listOutOfStock.push(product_code);
    }
  }

  return {
    isValid: !Boolean(listOutOfStock.length),
    listOutOfStock: listOutOfStock,
  };
};
// sau khi user thanh toán xong thì cần phải lưu lại bills để quản lý status bill và thống kê sau này.

export const orderByUser = async (req) => {
  const { id, user_address, user_payment } = req.body ?? {};
  const userId = req.headers[HEADER.CLIENT_ID];
  const productRepository = getCustomRepository(ProductsRepository);
  const cartRepository = getCustomRepository(CartsRepository);

  const foundCarts = await findCartById({ id: id });

  if (!userId) throw new AuthFailureError("Không có quyền đăng nhập");
  if (!foundCarts) throw new BadRequestError("Không tìm thấy cart nào!");

  if (foundCarts.cart_state == "success") throw new BadRequestError("Bạn đã xác nhận đơn này rồi, vui lòng thử lại!");
  if (foundCarts.cart_state == "failed") throw new BadRequestError("Đơn này đã bị huỷ, vui lòng tạo lại đơn mới!");

  const cartProducts = JSON.parse(foundCarts.cart_products);

  const statusProducts = await checkValidProducts(cartProducts);

  if (statusProducts.isValid) {
    for (let i = 0; i < cartProducts.length; i++) {
      const { product_code, product_quantity } = cartProducts[i];
      const foundProduct = await getProductByProductCode({ product_code });

      await productRepository.update(
        {
          product_code,
        },
        {
          product_quantity: foundProduct.product_quantity - product_quantity,
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

    //insert to bill after enhance

    const foundCartsById = await findCartById({ id });
    const data = await checkOrder({ foundCarts: foundCartsById });

    await insertBill({
      cart_id: foundCarts.id,
      total_price: data?.totalPrice,
      cartProducts: data?.cartProducts,
      total_customer_price: data?.totalPrice,
      usr_id: userId,
    });

    return responseClient({
      status: "1",
      message: "Bạn đã xác nhận đơn thành công!",
    });
  } else {
    return responseClient({
      message: `Sản phẩm có mã ${statusProducts.listOutOfStock.map(
        (item) => item
      )} bị quá số lượng, vui lòng thử lại! `,
      status: "-1",
      data: statusProducts.listOutOfStock,
    });
  }
};

export const cancelByUser = async (req) => {
  const { id } = req.body ?? {};
  const cartRepository = getCustomRepository(CartsRepository);

  const foundCarts = await findCartById({ id: id });

  if (!foundCarts) throw new BadRequestError("Không tìm thấy đơn nào!");
  if (foundCarts.cart_state == "failed") throw new BadRequestError("Đơn này đã bị huỷ, vui lòng tạo lại đơn mới!");

  if (foundCarts) {
    await cartRepository.update(
      {
        id,
      },
      {
        cart_state: "failed",
      }
    );

    return responseClient({
      status: "1",
      message: "Bạn đã huỷ đơn thành công!",
    });
  } else {
    return responseClient({
      status: "-1",
      message: MESSAGE_NOTFOUND,
    });
  }
};
