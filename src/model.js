import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      default: null,
    },
    title: {
      type: String,
      required: true,
      default: null,
    },
    price: {
      type: Number,
      required: true,
      default: null,
    },
    description: {
      type: String,
      required: true,
      default: null,
    },
    category: {
      type: String,
      required: true,
      default: null,
    },
    image: {
      type: String,
      required: true,
      default: null,
    },
    sold: {
      type: Boolean,
      required: true,
      default: null,
    },
    dateOfSale: {
      type: Date,
      required: true,
      default: null,
    },
  },
  { timestamps: true }
);

export const ProductModel = new mongoose.model("ProductModel", productSchema);
