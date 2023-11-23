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
