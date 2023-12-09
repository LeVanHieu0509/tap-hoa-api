import APIError from "../apps/global/response/apierror";
import auth from "./auth";
import bills from "./bills";
import carts from "./carts";
import checkout from "./checkout";
import pdf from "./pdf";
import products from "./products";
import categories from "./categories";
import dashboard from "./dashboard";

function route(app) {
  app.use(
    "/v1/api/user",
    function (req, res, next) {
      next();
    },
    auth
  );

  app.use(
    "/v1/api/pdf",
    function (req, res, next) {
      next();
    },
    pdf
  );

  app.use(
    "/v1/api/products",
    function (req, res, next) {
      next();
    },
    products
  );

  app.use(
    "/v1/api/carts",
    function (req, res, next) {
      next();
    },
    carts
  );

  app.use(
    "/v1/api/checkout",
    function (req, res, next) {
      next();
    },
    checkout
  );

  app.use(
    "/v1/api/bills",
    function (req, res, next) {
      next();
    },
    bills
  );

  app.use(
    "/v1/api/categories",
    function (req, res, next) {
      next();
    },
    categories
  );

  app.use(
    "/v1/api/dashboard",
    function (req, res, next) {
      next();
    },
    dashboard
  );

  app.use((req, res, next) => {
    const error = new APIError("Not Found", 1237, 404);
    next(error);
  });
  app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      status: "error",
      code: statusCode,
      message: error.message || "Internal Server Error",
    });
  });
}
export default route;
