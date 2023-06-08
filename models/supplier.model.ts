import mongoose, { Schema } from "mongoose";
import { addressesSchema } from "./address.model";
const supplierSchema = new Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    name: {
      type: String,
    },
    addresses: [addressesSchema],
    photoUrl: {
      type: String,
    },
    lastLogin: {
      type: Date,
    },
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
  },
  { timestamps: true }
);

export const SupplierModel = mongoose.model("Supplier", supplierSchema);
