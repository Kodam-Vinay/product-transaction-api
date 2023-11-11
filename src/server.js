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
  await ProductModel.insertMany(data);
});

app.get("/search/", async (req, res) => {
  try {
    let { search_q = "", page, limit } = req.query;
    console.log(search_q);
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const skip = (page - 1) * limit;
    const result = await ProductModel.find().skip(skip).limit(limit);
    const filterData = result.filter(
      (each) =>
        each?.title?.toLowerCase()?.includes(search_q?.toLowerCase()) ||
        each?.description?.toLowerCase()?.includes(search_q?.toLowerCase()) ||
        each?.price === Number(search_q)
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
    const monthNumber = req.query.month - 1;
    const result = await ProductModel.find();
    const filterData = result.filter(
      (each) => new Date(each?.dateOfSale).getMonth() === monthNumber
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

app.get("/price-range", async (req, res) => {
  try {
    const result = await ProductModel.find();
    const zeroToHundread = result.filter(
      (each) => each?.price > 0 && each?.price <= 100
    );
    const hundreadToTwoHundread = result.filter(
      (each) => each?.price > 100 && each?.price <= 200
    );
    const twoHundreadToThreeHundread = result.filter(
      (each) => each?.price > 200 && each?.price <= 300
    );
    const threeHundreadToFourHundread = result.filter(
      (each) => each?.price > 300 && each?.price <= 400
    );
    const fourHundreadToFiveHundread = result.filter(
      (each) => each?.price > 400 && each?.price <= 500
    );
    const fiveHundreadToSixHundread = result.filter(
      (each) => each?.price > 500 && each?.price <= 600
    );
    const sixHundreadToSevenHundread = result.filter(
      (each) => each?.price > 600 && each?.price <= 700
    );
    const sevenHundreadToEightHundread = result.filter(
      (each) => each?.price > 700 && each?.price <= 800
    );
    const eightHundreadToNineHundread = result.filter(
      (each) => each?.price > 800 && each?.price <= 900
    );
    const aboveNineHundread = result.filter((each) => each?.price > 900);
    res.status(200).send({
      zeroToHundread,
      hundreadToTwoHundread,
      twoHundreadToThreeHundread,
      threeHundreadToFourHundread,
      fourHundreadToFiveHundread,
      fiveHundreadToSixHundread,
      sixHundreadToSevenHundread,
      sevenHundreadToEightHundread,
      eightHundreadToNineHundread,
      aboveNineHundread,
    });
  } catch (error) {
    res.status(500).send(500);
  }
});

app.get("/unique-category", async (req, res) => {
  try {
    const result = await ProductModel.find();
    let uniqueCategories = {};
    result.map((each) => {
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
