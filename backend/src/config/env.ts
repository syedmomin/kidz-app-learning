import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 4000,
  HOST: process.env.HOST || "0.0.0.0"
};
