import compression from "compression";
import * as dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import path from "path";
import "reflect-metadata";
import { Container } from "typedi";
import * as TypeORM from "typeorm";
import route from "./routes";
import rabbitMQService from "./apps/services/consumerQueue.service";
import cors = require("cors");

//nằm ở đây và chiếm bộ nhớ. có thể gây ra conflict khi đặt.

dotenv.config();

// register 3rd party IOC container
TypeORM.useContainer(Container);

const bootstrap = async () => {
  try {
    const app = express();

    app.use(morgan("combined"));
    app.use(compression());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, "public")));
    // create TypeORM connection
    // await TypeORM.createConnection();

    const corsConfig = {
      methods: "GET, HEAD, PUT,PATCH,POST,DELETE,OPTIONS",
      credentials: true,
      origin: [/localhost*/],
    };
    require("./dbs/init.my-sql");
    route(app);

    app.use(cors(corsConfig));

    app.listen(3000, () => {
      console.log(`Listening on port ${3000}`);
    });
  } catch (err) {
    console.error(err);
  }
};

bootstrap();
