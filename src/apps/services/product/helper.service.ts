import { get } from "lodash";
import { crawlDataProductCode } from "../../../services/api";

export const getCrawlProduct = async ({ product_bar_code }) => {
  const { data } = await crawlDataProductCode({
    offset: 1,
    fields: ["id", "sku", "name", "label", "price", "url_key", "image_url"],
    where: {
      query: product_bar_code,
    },
  });

  return data;
};
