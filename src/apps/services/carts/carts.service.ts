import { getCustomRepository } from "typeorm";
import { HEADER } from "../../auth/authUtils";
import { MESSAGE_ADD_SUCCESS, MESSAGE_DELETE_FAILED, MESSAGE_DELETE_SUCCESS, MESSAGE_NOTFOUND } from "../../constants";
import { CartsRepository } from "../../repositories/carts.repository";
import { findAllCarts, findCartById, findCartByUser } from "./repo.service";

export const addNewCarts = async (req) => {
  const { products } = req.body ?? {};
  const usr_id = req.headers[HEADER.CLIENT_ID];

  const cartRepository = getCustomRepository(CartsRepository);

  const newCart = await cartRepository.create({
    usr_id: usr_id,
    cart_products: JSON.stringify(products),
    cart_state: "active",
  });

  return await cartRepository.save(newCart);
};

// Duoi FE se truyen tat ca san pham trong hoa don len de update
export const addToCarts = async (req) => {
  const { id, products } = req.body ?? {};
  const usr_id = req.headers[HEADER.CLIENT_ID];

  const cartRepository = getCustomRepository(CartsRepository);
  const fountCard = await findCartByUser({ usr_id });

  if (fountCard) {
    const result = await cartRepository.update(
      {
        id: id,
      },
      {
        cart_products: JSON.stringify(products),
      }
    );

    return {
      status: result.affected,
      message: MESSAGE_ADD_SUCCESS,
    };
  }
};

export const updateCarts = async (req) => {
  const data = req.body ?? {};
  const { id, products } = data ?? {};
  const usr_id = req.headers[HEADER.CLIENT_ID];

  const cartRepository = getCustomRepository(CartsRepository);
  const fountCard = await findCartByUser({ usr_id });

  if (fountCard) {
    const result = await cartRepository.update(
      {
        id: data.id,
      },
      {
        cart_products: JSON.stringify(products),
      }
    );

    return {
      status: result.affected,
      message: MESSAGE_ADD_SUCCESS,
    };
  }
};

export const deleteCarts = async (data) => {
  const { id } = data ?? {};
  const cartRepository = getCustomRepository(CartsRepository);

  const deleteKey = await cartRepository.delete({ id });

  if (deleteKey.affected == 1) {
    return {
      status: "1",
      message: MESSAGE_DELETE_SUCCESS,
    };
  } else {
    return {
      status: "-1",
      message: MESSAGE_DELETE_FAILED,
    };
  }
};

export const getDetailCarts = async (req) => {
  const { id } = req.body ?? {};
  const foundCards = await findCartById({ id });

  if (foundCards) {
    return {
      status: "1",
      data: foundCards,
    };
  } else {
    return {
      status: "-1",
      message: MESSAGE_NOTFOUND,
    };
  }
};

export const getAllCarts = async ({ limit, sortOrder, sortBy, page, filter, select }) => {
  const foundCards = await findAllCarts({ limit, sortOrder, sortBy, page, filter, select });

  if (foundCards) {
    return {
      status: "1",
      data: foundCards,
    };
  } else {
    return {
      status: "-1",
      message: MESSAGE_NOTFOUND,
    };
  }
};
