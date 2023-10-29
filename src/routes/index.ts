import APIError from "../apps/global/response/apierror";
import auth from "./auth";
import products from "./products";

function route(app) {
  app.use(
    "/v1/api",
    function (req, res, next) {
      next();
    },
    auth
  );
  app.use(
    "/v1/api",
    function (req, res, next) {
      next();
    },
    products
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
