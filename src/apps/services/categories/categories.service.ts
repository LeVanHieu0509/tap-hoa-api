import { getCustomRepository } from "typeorm";
import { CategoriesRepository } from "../../repositories/categories.repository";
import { responseClient } from "../../../utils";
import { MESSAGE_GET_SUCCESS } from "../../constants";

export const getCategories = async () => {
  const categoriesRepository = getCustomRepository(CategoriesRepository);

  const cate = await categoriesRepository.find();

  return responseClient({
    message: MESSAGE_GET_SUCCESS,
    status: "1",
    data: cate,
  });
};
