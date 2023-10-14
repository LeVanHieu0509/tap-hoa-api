import * as TypeORM from "typeorm";
import Container from "typedi";
import { countConnect } from "../helpers/check.connect";
TypeORM.useContainer(Container);

class Database {
  static instance: any;

  constructor() {
    this.connect();
  }

  //connect
  async connect() {
    await TypeORM.createConnection()
      .then(() =>
        console.log("Connect Database my sql Success", countConnect())
      )
      .catch((err) => {
        console.log("Connect Database my sql Failed", err);
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceSqlServer = Database.getInstance();

module.exports = instanceSqlServer;
