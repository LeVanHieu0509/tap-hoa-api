import { getCustomRepository } from "typeorm";
import { HEADER } from "../../auth/authUtils";
import {
  MESSAGE_ADD_FAILED,
  MESSAGE_ADD_SUCCESS,
  MESSAGE_DELETE_FAILED,
  MESSAGE_DELETE_SUCCESS,
  MESSAGE_GET_SUCCESS,
  MESSAGE_NOTFOUND,
  MESSAGE_UPDATE_SUCCESS,
} from "../../constants";
import { CartsRepository } from "../../repositories/carts.repository";
import { findAllCarts, findCartById, findCartByUser } from "./repo.service";
import { responseClient } from "../../../utils";

export const addNewCarts = async (req) => {
  const { products } = req.body ?? {};
  const usr_id = req.headers[HEADER.CLIENT_ID];

  const cartRepository = getCustomRepository(CartsRepository);

  const newCart = await cartRepository.create({
    usr_id: usr_id,
    cart_products: JSON.stringify(products),
    cart_state: "active",
  });

  const result = await cartRepository.save(newCart);

  if (result) {
    return responseClient({
      status: "1",
      data: result,
      message: MESSAGE_ADD_SUCCESS,
    });
  } else {
    return responseClient({
      status: "-1",
      message: MESSAGE_ADD_FAILED,
    });
  }
};

// Duoi FE se truyen tat ca san pham trong hoa don len de update
export const addToCarts = async (req) => {
  const { id, products } = req.body ?? {};

  const cartRepository = getCustomRepository(CartsRepository);
  const fountCard = await findCartById({ id });

  if (fountCard) {
    const result = await cartRepository.update(
      {
        id: id,
      },
      {
        cart_products: JSON.stringify(products),
      }
    );

    if (result.affected == 1) {
      return responseClient({
        status: result.affected,
        message: MESSAGE_ADD_SUCCESS,
      });
    }
  } else {
    return responseClient({
      status: "-1",
      message: MESSAGE_NOTFOUND,
    });
  }
};

export const updateCarts = async (req) => {
  const data = req.body ?? {};
  const { id, products } = data ?? {};

  const cartRepository = getCustomRepository(CartsRepository);
  const fountCard = await findCartById({ id });

  if (fountCard.cart_state == "active") {
    const result = await cartRepository.update(
      {
        id: data.id,
      },
      {
        cart_products: JSON.stringify(products),
      }
    );

    return responseClient({
      status: result.affected,
      message: MESSAGE_UPDATE_SUCCESS,
    });
  } else {
    return responseClient({
      status: "-1",
      message: MESSAGE_NOTFOUND,
    });
  }
};

export const deleteCarts = async (data) => {
  const { id } = data ?? {};
  const cartRepository = getCustomRepository(CartsRepository);

  const deleteKey = await cartRepository.delete({ id });

  if (deleteKey.affected == 1) {
    return responseClient({
      status: "1",
      message: MESSAGE_DELETE_SUCCESS,
    });
  } else {
    return responseClient({
      status: "-1",
      message: MESSAGE_DELETE_FAILED,
    });
  }
};

export const getDetailCarts = async (req) => {
  const { id } = req.body ?? {};
  const foundCards = await findCartById({ id });

  if (foundCards) {
    return responseClient({
      status: "1",
      data: foundCards,
      message: MESSAGE_ADD_SUCCESS,
    });
  } else {
    return responseClient({
      status: "-1",
      message: MESSAGE_NOTFOUND,
    });
  }
};

export const getAllCarts = async ({ limit, sortOrder, sortBy, page, filter, select }) => {
  const foundCards = await findAllCarts({ limit, sortOrder, sortBy, page, filter, select });

  if (foundCards) {
    return responseClient({
      status: "1",
      data: foundCards,
      message: MESSAGE_GET_SUCCESS,
    });
  } else {
    return {
      status: "-1",
      message: MESSAGE_NOTFOUND,
    };
  }
};
