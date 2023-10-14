module.exports = {
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(`${process.env.DB_PORT}`),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: ["src/apps/modules/entities/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  extra: {
    charset: "utf8mb4",
  },
  // options: {
  //     encrypt: false,
  //     useUTC: true,
  // },
  // maxPoolSize: 90, // đặt giới hạn số kết nối trong pool
  // pool: {
  //     max: 100,
  //     min: 0,
  //     idleTimeoutMillis: 3600000,
  // },
};
