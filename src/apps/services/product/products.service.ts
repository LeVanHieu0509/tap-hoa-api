import { get, head } from "lodash";
import { customAlphabet } from "nanoid";
import { getCustomRepository } from "typeorm";
import { generateId, isCheckHasValue, responseClient } from "../../../utils";
import {
  MESSAGE_ADD_FAILED,
  MESSAGE_ADD_SUCCESS,
  MESSAGE_DELETE_FAILED,
  MESSAGE_DELETE_SUCCESS,
  MESSAGE_GET_SUCCESS,
  MESSAGE_NOTFOUND,
  MESSAGE_PRODUCT_CODE_CONFLICT,
  MESSAGE_SUCCESS,
  MESSAGE_UPDATE_FAILED,
  MESSAGE_UPDATE_SUCCESS,
} from "../../constants";
import Products from "../../modules/entities/product.entity";
import { ProductsRepository } from "../../repositories/products.reposiotory";
import { getCrawlProduct } from "./helper.service";
import { findAllProducts, getProductByProductBarCode, getProductByProductCode } from "./repo.service";
import { BadRequestError } from "../../../core/error.response";
import { crawlDataProductMykiot, crawlDataProductSieuThiDucThanh } from "../../../services/api";

export const getProduct = async (data) => {
  const { product_code, product_bar_code } = data ?? {};

  if (product_code) {
    const foundProduct = await getProductByProductCode({ product_code });

    return responseClient({
      status: "1",
      data: foundProduct ?? {},
      message: MESSAGE_SUCCESS,
    });
  } else if (product_bar_code) {
    const foundProduct = await getProductByProductBarCode({ product_bar_code });

    return responseClient({
      status: "1",
      data: foundProduct ?? {},
      message: MESSAGE_SUCCESS,
    });
  } else {
    return responseClient({
      status: "-1",
      message: MESSAGE_NOTFOUND,
    });
  }
};

export const createProduct = async (data: Products) => {
  //case: nhân viên sẽ quét mã vạch
  //1. Filed vào ô product_bar_code ==> có
  //2. Gen auto ra product_code ==> có (nếu null thì gen ra)
  // Lưu 2 mã product_code product_bar_code vào.

  //case: nhân viên ko quét mã vạch mà họ nhập Mã code_product.
  //1. Filed vào ô product_bar_code => không
  //2. Mã product_code được nhập từ nhân viên => buộc nhập
  // Lưu 1 product_code mã vào.

  //1. Buộc phải có product_code (Nếu không có thì phải thì phải tự gen ra rồi mới lưu vào db)
  //2. Case1: User nhập product_bar_code và nhập product_code
  //3. Case2: User nhập product_bar_code và ko nhập product_code
  //4. Case3: User nhập product_code và ko nhập product_bar_code
  //5. Áp dụng cho thêm và update sản phẩm
  //6. Trường hợp thêm:
  // - Tìm product => ko có => Tạo mới
  // - Có => update
  //7. Trường hợp update thì chỉ update số lượng mới cộng vào số lượng cũ, và đổi ngày hết hạn.

  let {
    product_name,
    product_image_url,
    product_code,
    product_bar_code,
    product_quantity,
    product_manufacture_date,
    product_expired_date,
    categories,
  } = data ?? {};

  let gen_product_bar_code = 0;
  let foundProduct: Products;
  // let dataCrawlProduct;
  const productRepository = getCustomRepository(ProductsRepository);

  if (isCheckHasValue(product_bar_code) && isCheckHasValue(product_code)) {
    foundProduct = await getProductByProductBarCode({ product_bar_code });
  } else if (isCheckHasValue(product_bar_code) && !isCheckHasValue(product_code)) {
    foundProduct = await getProductByProductBarCode({ product_bar_code });

    //set product code auto when only product code bar
    if (!foundProduct) {
      product_code = `SP${generateId()}`;
    } else {
      product_code = foundProduct.product_code;
    }
  } else if (isCheckHasValue(product_code) && !isCheckHasValue(product_bar_code)) {
    foundProduct = await getProductByProductCode({ product_code });
    product_bar_code = `${generateId(12)}`;
    gen_product_bar_code = 1;
  } else {
    throw new BadRequestError("Vui lòng nhập Mã code hoặc mã vạch");
  }

  //Crawl API get name product
  // if (product_bar_code) {
  //   const resCrawlProduct = await getCrawlProduct({ product_bar_code });
  //   dataCrawlProduct = resCrawlProduct.data.items;
  // }

  // if you find product has in store, only update product_quantity up to quantity
  if (foundProduct) {
    const result = await productRepository.update(
      {
        product_code,
      },
      {
        product_image_url: product_image_url,
        product_name,
        product_manufacture_date,
        product_expired_date,
        product_quantity: foundProduct.product_quantity + product_quantity,
      }
    );

    if (result.affected == 1) {
      return responseClient({
        status: "1",
        message: MESSAGE_UPDATE_SUCCESS,
      });
    } else {
      return responseClient({
        status: "-1",
        message: MESSAGE_PRODUCT_CODE_CONFLICT,
      });
    }
  } else {
    const product = productRepository.create({
      ...data,
      product_bar_code,
      product_code: product_code,
      categories: categories,
      product_name: product_name,
      product_image_url: product_image_url,
      is_gen_product_bar_code: gen_product_bar_code,
    });

    const newProduct = await productRepository.save(product);

    if (newProduct) {
      return responseClient({
        status: "1",
        data: newProduct,
        message: MESSAGE_ADD_SUCCESS,
      });
    } else {
      return responseClient({
        status: "-1",
        message: MESSAGE_ADD_FAILED,
      });
    }
  }
};

export const getProducts = async ({
  searchText,
  limit,
  sortOrder,
  sortBy,
  page,
  priceMin,
  priceMax,
  filter = null,
  select = null,
}: any) => {
  const { products, total } = await findAllProducts({
    searchText,
    limit,
    sortOrder,
    sortBy,
    page,
    filter,
    select,
    priceMin,
    priceMax,
  });

  return {
    status: "1",
    data: {
      products,
      total,
    },
  };
};

export const deleteProduct = async ({ product_code }) => {
  const productRepository = getCustomRepository(ProductsRepository);
  const foundProduct = await getProductByProductCode({ product_code });

  if (foundProduct) {
    const deleteKey = await productRepository.delete({ product_code });

    return responseClient({
      status: deleteKey.affected,
      message: MESSAGE_DELETE_SUCCESS,
    });
  } else {
    return responseClient({
      status: "-1",
      message: MESSAGE_NOTFOUND,
    });
  }
};

export const updateProduct = async (data) => {
  const { product_code } = data ?? {};
  const productRepository = getCustomRepository(ProductsRepository);
  const foundProduct = await getProductByProductCode({ product_code });

  if (foundProduct) {
    const result = await productRepository.update(
      {
        product_code,
      },
      {
        ...data,
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

export const generalAutoProduct = async (data) => {
  const { product_bar_code } = data ?? {};

  //Crawl API get name product
  if (product_bar_code) {
    const resCrawlProduct = await getCrawlProduct({ product_bar_code });
    const dataCrawlProduct = resCrawlProduct.data.items;

    if (!dataCrawlProduct?.length) {
      const {
        data: { results },
      } = await crawlDataProductSieuThiDucThanh({ product_bar_code: product_bar_code });

      if (results?.length) {
        return responseClient({
          status: "1",
          message: MESSAGE_GET_SUCCESS,
          data: {
            product_name: results[0].title,
            product_image_url: `https:${results[0].thumbnail}`,
          },
        });
      } else {
        return responseClient({
          status: "-1",
          message: MESSAGE_NOTFOUND,
        });
      }
    } else {
      return responseClient({
        status: "1",
        message: MESSAGE_GET_SUCCESS,
        data: {
          product_name: get(head(dataCrawlProduct), "name"),
          product_image_url: get(head(dataCrawlProduct), "image_url"),
        },
      });
    }
  } else {
    return responseClient({
      status: "-1",
      message: MESSAGE_NOTFOUND,
    });
  }
};
