import { responseClient } from "../../../utils";
import { MESSAGE_ADD_SUCCESS, MESSAGE_NOTFOUND } from "../../constants";

export const getOverviewDashboard = async () => {
  // Xem được thông tin hoá đơn
  // Xem được thông tin khách hàng
  // xem thông tin nhân viên nào order
  // Xem sản phẩm trong bill, giá, .... (get tới cái mã cart)
  const foundBill = 1;

  //1. Tinh doanh thu
  //2. Tính lợi nhuận
  //3. Tính tổng hoá đơn
  //4. Tính số lượng sản phẩm

  //5. Get sản phẩm bán chạy

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
};
