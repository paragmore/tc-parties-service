import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema({
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  firstLine: {
    type: String,
  },
  secondLine: {
    type: String,
  },
  pinCode: {
    type: String,
  },
  district: {
    type: String,
  },
});
const storeSchema = new Schema(
  {
    name: {
      type: String,
    },
    logoUrl: {
      type: String,
    },
    businessType: {
      type: String,
    },
    businessDomain: {
      type: String,
    },
    gstNumber: {
      type: String,
    },
    allowCreditReportAccess: {
      type: Boolean,
    },
    onlineStoreLive: {
      type: Boolean,
    },
    plan: {
      type: String,
    },
    address: {
      type: addressSchema,
    },
    location: {
      type: String,
    },
    companyType: {
      type: String,
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

export const StoreModel = mongoose.model("Store", storeSchema);
