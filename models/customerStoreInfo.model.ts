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
  tradeName: {
    type: String,
  },
  addresses: [addressesSchema],
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  gstin: {
    type: String,
  },
  gstType: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
  },
});

export const CustomerStoreInfoModel = mongoose.model(
  "CustomerStoreInfo",
  customerStoreInfoSchema
);
