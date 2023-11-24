import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const awplClient = axios.create({
  baseURL: process.env.SERVER_LOTTE_URL,
  headers: {
    maxBodyLength: Infinity,
    "Content-Type": "application/json",
    Authorization: process.env.SERVER_AUTHORIZATION,
  },
});

export function crawlDataProductCode(data) {
  return awplClient.post("/v1/p/mart/es/vi_vih/products/search", data);
}

const awplClientMykiot = axios.create({
  baseURL: process.env.SERVER_MYKIOT_URL,
  headers: {
    maxBodyLength: Infinity,
    "Content-Type": "application/json",
    ["Store-Id"]: "393008",
  },
});

export function crawlDataProductMykiot(data) {
  return awplClientMykiot.post("/api/v1/products/search", data);
}

const awplClientSieuThiDucThanh = axios.create({
  baseURL: process.env.SERVER_SIEUTHIDUCTHANH_URL,
  headers: {
    maxBodyLength: Infinity,
    "Content-Type": "application/json",
  },
});

export function crawlDataProductSieuThiDucThanh({ product_bar_code }) {
  return awplClientSieuThiDucThanh.get("/search", {
    params: {
      type: "product",
      view: "json",
      q: product_bar_code,
    },
    headers: {
      ["sec-ch-ua-mobile"]: "?1",
      authority: "sieuthiducthanh.com",
      accept: "*/*",
      cookie:
        "cart_currency=VND; _landing_page=%2Fsearch%3Ftype%3Dproduct%26q%3D893501880160%26view%3Djson; _orig_referrer=https%3A%2F%2Fsieuthiducthanh.com%2Fsearch%3Fquery%3D8935018801603; cart=473f42a6f815906f734b019413820eb7; cart_sig=e805b6faeaef55bba376ca0b23152a9d",
    },
  });
}
