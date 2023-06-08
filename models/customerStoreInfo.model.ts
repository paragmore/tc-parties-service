import mongoose, { Schema } from "mongoose";
import { addressesSchema } from "./address.model";

const customerStoreInfoSchema = new Schema({
  cart: {
    type: Schema.Types.ObjectId,
    ref: "Cart",
  },
  totalSpent: {
    type: Number,
    default: 0,
  },
  storeId: {
    type: Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  email: {
    type: String,
  },
  name: {
    type: String,
  },
  addresses: [addressesSchema],
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  gstin: {
    type: String,
  },
});

export const CustomerStoreInfoModel = mongoose.model(
  "CustomerStoreInfo",
  customerStoreInfoSchema
);
