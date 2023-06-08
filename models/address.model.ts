import { Schema } from "mongoose";

export const addressSchema = new Schema({
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
export const addressesSchema = new Schema({
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
