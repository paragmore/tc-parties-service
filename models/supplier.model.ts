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
    balance: {
      type: Number,
      default: 0,
    },
    gstin: {
      type: String,
    },
    gstType: {
      type: String,
      required: true,
    },
    addresses: [addressesSchema],
    photoUrl: {
      type: String,
    },
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    supplierStoreId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
    },
    isDeleted: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export const SupplierModel = mongoose.model("Supplier", supplierSchema);
