import mongoose, { Schema } from "mongoose";
import { addressesSchema } from "./address.model";

const customerSchema = new Schema(
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
    gstin: {
      type: String,
    },
    addresses: [addressesSchema],
    photoUrl: {
      type: String,
    },
    lastLogin: {
      type: Date,
    },
    searchQueries: [
      {
        searchTerm: {
          type: String,
          required: true,
        },
        storeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Store",
        },
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    favouriteProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

export const CustomerModel = mongoose.model("Customer", customerSchema);
