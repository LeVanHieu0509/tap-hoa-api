import { get, head } from "lodash";
import { getCustomRepository } from "typeorm";
import {
  MESSAGE_ADD_FAILED,
  MESSAGE_ADD_SUCCESS,
  MESSAGE_DELETE_FAILED,
  MESSAGE_DELETE_SUCCESS,
  MESSAGE_NOTFOUND,
  MESSAGE_UPDATE_SUCCESS,
} from "../../constants";
import Products from "../../modules/entities/product.entity";
import { ProductsRepository } from "../../repositories/products.reposiotory";
import { getCrawlProduct } from "./helper.service";
import { findAllProducts, getProductByCode } from "./repo.service";

export const getProduct = async ({ product_code }) => {
  const foundProduct = await getProductByCode({ product_code });

  return {
    status: "1",
    data: foundProduct ?? {},
  };
};

export const createProduct = async (data: Products) => {
  const {
    product_name,
    product_image_url,
    product_code,
    product_quantity,
    product_manufacture_date,
    product_expired_date,
    categories,
  } = data ?? {};

  const productRepository = getCustomRepository(ProductsRepository);
  const foundProduct = await getProductByCode({ product_code });

  const resCrawlProduct = await getCrawlProduct({ product_code });
  const dataProduct = resCrawlProduct.data.items;

  //check exits san pham
  if (foundProduct) {
    const result = await productRepository.update(
      {
        product_code,
      },
      {
        product_quantity: (await foundProduct).product_quantity + product_quantity,
        product_manufacture_date,
        product_expired_date,
      }
    );
    if (result.affected == 1) {
      return {
        status: "1",
        message: MESSAGE_UPDATE_SUCCESS,
      };
    } else {
      return {
        status: "-1",
        message: MESSAGE_DELETE_FAILED,
      };
    }
  } else {
    const product = productRepository.create({
      ...data,
      categories: categories,
      product_name: dataProduct ? get(head(dataProduct), "name") : product_name,
      product_image_url: dataProduct ? get(head(dataProduct), "image_url") : product_image_url,
    });

    const newProduct = await productRepository.save(product);

    if (newProduct) {
      return {
        status: "1",
        message: MESSAGE_ADD_SUCCESS,
      };

      //insert inventory
    } else {
      return {
        status: "-1",
        message: MESSAGE_ADD_FAILED,
      };
    }
  }
};

export const getProducts = async ({
  limit,
  sortOrder,
  sortBy = "ctime",
  page,
  priceMin,
  priceMax,
  filter = { isPublished: true },
  select = [
    "product_code",
    "product_name",
    "product_description",
    "product_image_url",
    "product_price_origin",
    "product_price_sell",
    "product_quantity",
    "product_manufacture_date",
    "product_expired_date",
  ],
}: any) => {
  return await findAllProducts({
    limit,
    sortOrder,
    sortBy,
    page,
    filter,
    select,
    priceMin,
    priceMax,
  });
};

export const deleteProduct = async ({ product_code }) => {
  const productRepository = getCustomRepository(ProductsRepository);
  const foundProduct = await getProductByCode({ product_code });

  if (foundProduct) {
    const deleteKey = await productRepository.delete({ product_code });

    return {
      status: deleteKey.affected,
      message: MESSAGE_DELETE_SUCCESS,
    };
  } else {
    return {
      status: "-1",
      message: MESSAGE_NOTFOUND,
    };
  }
};

export const updateProduct = async (data) => {
  const { product_code } = data ?? {};
  const productRepository = getCustomRepository(ProductsRepository);
  const foundProduct = await getProductByCode({ product_code });

  if (foundProduct) {
    const result = await productRepository.update(
      {
        product_code,
      },
      {
        ...data,
      }
    );

    return {
      status: result.affected,
      message: MESSAGE_UPDATE_SUCCESS,
    };
  } else {
    return {
      status: "-1",
      message: MESSAGE_NOTFOUND,
    };
  }
};
