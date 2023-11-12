import express from "express";
import cors from "cors";
import "dotenv/config";
import "./connection.js";
import { THIRD_PARTY_URL } from "./constants.js";
import { ProductModel } from "./model.js";
const PORT = process.env.PORT || 8001;
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/store-to-db", async () => {
  const response = await fetch(THIRD_PARTY_URL);
  const data = await response.json();
  const storedData = await ProductModel.insertMany(data);
  res.status(200).send({ message: "stored to Db", data: storedData });
});

app.get("/search", async (req, res) => {
  try {
    let { search_q = "", page, limit, month } = req.query;
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    month = month || 3;
    const skip = (page - 1) * limit;
    const result = await ProductModel.find().skip(skip).limit(limit);
    const filterData = result.filter(
      (each) =>
        (each?.title?.toLowerCase()?.includes(search_q?.toLowerCase()) ||
          each?.description?.toLowerCase()?.includes(search_q?.toLowerCase()) ||
          each?.price === Number(search_q)) &&
        new Date(each?.dateOfSale).getMonth() === month - 1
    );
    res
      .status(200)
      .send({ data: filterData, items: filterData.length, page: page });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/stats", async (req, res) => {
  try {
    const monthNumber = req.query.month || 3;
    const result = await ProductModel.find();
    const filterData = result.filter(
      (each) => new Date(each?.dateOfSale).getMonth() === monthNumber - 1
    );
    const totalSale = filterData.reduce(
      (accumulator, { price }) => accumulator + price,
      0
    );
    const soldItems = filterData.filter((each) => each?.sold);
    const notSoldItems = filterData.filter((each) => !each?.sold);
    const noOfSoldItems = soldItems.length;
    const noOfNotSoldItems = notSoldItems.length;
    res.status(200).send({
      totalSale,
      noOfSoldItems,
      noOfNotSoldItems,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/price-range-stats", async (req, res) => {
  try {
    const monthNumber = req.query.month || 3;
    const result = await ProductModel.find();
    const zeroToHundread = result.filter(
      (each) =>
        new Date(each?.dateOfSale).getMonth() === monthNumber - 1 &&
        each?.price > 0 &&
        each?.price <= 100
    );
    const hundreadToTwoHundread = result.filter(
      (each) =>
        each?.price > 100 &&
        each?.price <= 200 &&
        new Date(each?.dateOfSale).getMonth() === monthNumber - 1
    );
    const twoHundreadToThreeHundread = result.filter(
      (each) =>
        each?.price > 200 &&
        each?.price <= 300 &&
        new Date(each?.dateOfSale).getMonth() === monthNumber - 1
    );
    const threeHundreadToFourHundread = result.filter(
      (each) =>
        each?.price > 300 &&
        each?.price <= 400 &&
        new Date(each?.dateOfSale).getMonth() === monthNumber - 1
    );
    const fourHundreadToFiveHundread = result.filter(
      (each) =>
        each?.price > 400 &&
        each?.price <= 500 &&
        new Date(each?.dateOfSale).getMonth() === monthNumber - 1
    );
    const fiveHundreadToSixHundread = result.filter(
      (each) =>
        each?.price > 500 &&
        each?.price <= 600 &&
        new Date(each?.dateOfSale).getMonth() === monthNumber - 1
    );
    const sixHundreadToSevenHundread = result.filter(
      (each) =>
        each?.price > 600 &&
        each?.price <= 700 &&
        new Date(each?.dateOfSale).getMonth() === monthNumber - 1
    );
    const sevenHundreadToEightHundread = result.filter(
      (each) =>
        each?.price > 700 &&
        each?.price <= 800 &&
        new Date(each?.dateOfSale).getMonth() === monthNumber - 1
    );
    const eightHundreadToNineHundread = result.filter(
      (each) =>
        each?.price > 800 &&
        each?.price <= 900 &&
        new Date(each?.dateOfSale).getMonth() === monthNumber - 1
    );
    const aboveNineHundread = result.filter(
      (each) =>
        each?.price > 900 &&
        new Date(each?.dateOfSale).getMonth() === monthNumber - 1
    );
    res.status(200).send([
      { name: "0-100", value: zeroToHundread.length },
      { name: "101-200", value: hundreadToTwoHundread.length },
      { name: "201-300", value: twoHundreadToThreeHundread.length },
      { name: "301-400", value: threeHundreadToFourHundread.length },
      { name: "401-500", value: fourHundreadToFiveHundread.length },
      { name: "501-600", value: fiveHundreadToSixHundread.length },
      { name: "601-700", value: sixHundreadToSevenHundread.length },
      { name: "701-800", value: sevenHundreadToEightHundread.length },
      { name: "701-800", value: eightHundreadToNineHundread.length },
      { name: "901 above", value: aboveNineHundread.length },
    ]);
  } catch (error) {
    res.status(500).send(500);
  }
});

app.get("/unique-category", async (req, res) => {
  try {
    const monthNumber = req.query.month || 3;
    const result = await ProductModel.find();
    let uniqueCategories = {};
    const filterData = result.filter(
      (each) => new Date(each?.dateOfSale).getMonth() === monthNumber - 1
    );
    filterData.map((each) => {
      if (!uniqueCategories.hasOwnProperty(each?.category)) {
        uniqueCategories[each?.category] = 1;
      } else {
        uniqueCategories[each?.category] += 1;
      }
    });
    res.status(200).send(uniqueCategories);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.log("Server Running at port: " + PORT);
});
