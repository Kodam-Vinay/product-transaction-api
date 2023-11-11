import mongoose from "mongoose";
import "dotenv/config";

const DB_URL = process.env.DB_URL;

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log("connection fail due to" + err);
  });
