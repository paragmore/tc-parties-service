import mongoose, { Schema } from "mongoose";

const customerStoreInfoSchema = new Schema({
  cart: {
    type: Schema.Types.ObjectId,
    ref: "Cart",
  },
  searchQueries: [
    {
      type: String,
    },
  ],
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
});
const addressSchema = new Schema({
  line1: {
    type: String,
    required: true,
  },
  line2: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pinCode: {
    type: String,
    required: true,
  },
});
const addressesSchema = new Schema({
  shipping: {
    type: addressSchema,
    required: true,
  },
  billingSameAsShipping: {
    type: Boolean,
    required: true,
  },
  billing: {
    type: addressSchema,
  },
  name: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  type: {
    type: String,
  },
});
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
    addresses: [addressesSchema],
    photoUrl: {
      type: String,
    },
    lastLogin: {
      type: Date,
    },
    customerStoresInfo: [customerStoreInfoSchema],
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
