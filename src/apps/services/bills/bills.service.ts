import { getCustomRepository } from "typeorm";
import { BadRequestError } from "../../../core/error.response";
import { BillsRepository } from "../../repositories/bills.repository";
import { findCartById } from "../carts/repo.service";
import { generateId, responseClient } from "../../../utils";
import { findAllBills, findBillsById } from "./repo.service";
import { MESSAGE_ADD_SUCCESS, MESSAGE_GET_SUCCESS, MESSAGE_NOTFOUND } from "../../constants";

export const insertBill = async ({
  total_price,
  total_customer_price,
  total_refund_price,
  cartProducts,
  cart_id,
  usr_id,
}: {
  total_price: number;
  total_customer_price?: number;
  total_refund_price?: number;
  cartProducts: any;
  cart_id: any;
  usr_id: any;
}) => {
  const billRepository = getCustomRepository(BillsRepository);

  const foundCart = await findCartById({ id: cart_id });

  if (!foundCart) throw new BadRequestError("Không tìm thấy cart nào!");
  if (foundCart.cart_state !== "success")
    throw new BadRequestError("Có lỗi xảy ra với cart này, vui lòng liên hệ admin để xử lý");

  const newBill = await billRepository.create({
    bills_code: `TT${generateId()}`,

    cart: cart_id,
    status: "success",
    total_price,
    total_customer_price,
    total_refund_price,
    cart_products: JSON.stringify(cartProducts),
    user: usr_id,
  });

  await billRepository.save(newBill);
};

export const getBills = async ({ limit, sortOrder, sortBy, page, filter, select }: any) => {
  const foundBills = await findAllBills({ limit, sortOrder, sortBy, page, filter, select });

  if (foundBills) {
    return responseClient({
      status: "1",
      data: foundBills,
      message: MESSAGE_GET_SUCCESS,
    });
  } else {
    return {
      status: "-1",
      message: MESSAGE_NOTFOUND,
    };
  }
};

export const getBill = async (req) => {
  // Xem được thông tin hoá đơn
  // Xem được thông tin khách hàng
  // xem thông tin nhân viên nào order
  // Xem sản phẩm trong bill, giá, .... (get tới cái mã cart)

  const { id } = req.body ?? {};
  const foundBill = await findBillsById({ id });

  if (foundBill) {
    return responseClient({
      status: "1",
      data: foundBill,
      message: MESSAGE_ADD_SUCCESS,
    });
  } else {
    return responseClient({
      status: "-1",
      message: MESSAGE_NOTFOUND,
    });
  }

  return 2;
};
