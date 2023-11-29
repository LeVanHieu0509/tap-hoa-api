import { crawlDataProductCode } from "../../../services/api";

export const getCrawlProduct = async ({ product_bar_code }) => {
  const { data } = await crawlDataProductCode({
    limit: 50,
    offset: 1,
    facet_filters: {},
    fields: [
      "id",
      "sku",
      "name",
      "label",
      "price",
      "url_key",
      "image_url",
      "in_stock",
      "promotion",
      "stock_qty",
      "type_id",
      "custom_attribute.bundle_type",
      "ext_overall_rating",
      "ext_overall_review",
      "short_description",
      "bundle_options",
      "child_price",
      "child_stock",
      "configurable_options",
      "configurable_children",
    ],
    where: {
      query: product_bar_code,
    },
  });

  return data;
};

export const crawlDataProductMykiot = async ({ product_bar_code }) => {
  const { data } = await crawlDataProductCode({ key: product_bar_code });

  return data;
};
