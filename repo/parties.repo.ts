import { injectable } from "inversify";
import {
  CreatePartyRequestI,
  PartiesFilterByI,
  SortI,
  CustomerI,
  CustomerStoreInfoI,
  SupplierI,
  UpdatePartyRequestI,
  AddressI,
  AdrressesI,
} from "../types/types";
import mongoose, { MongooseError, SortOrder, Types } from "mongoose";
import { CustomerModel } from "../models/customer.model";
import { ApiError } from "../utils/ApiHelper";
import { StoreModel } from "../models/store.model";
import { CustomerStoreInfoModel } from "../models/customerStoreInfo.model";
import { SupplierModel } from "../models/supplier.model";

@injectable()
export class PartiesRepo {
  constructor() {}

  async createCustomer(createCustomerRequest: CustomerI) {
    const {
      phoneNumber,
      addresses,
      favouriteProducts,
      reviews,
      searchQueries,
      email,
      gstin,
      lastLogin,
      name,
      photoUrl,
    } = createCustomerRequest;
    const createdCustomer = await CustomerModel.create({
      phoneNumber,
      addresses,
      favouriteProducts,
      reviews,
      searchQueries,
      email,
      gstin,
      lastLogin,
      name,
      photoUrl,
    });
    return createdCustomer;
  }

  async createSupplier(createSupplierRequest: SupplierI) {
    const {
      phoneNumber,
      addresses,
      email,
      gstin,
      name,
      photoUrl,
      storeId,
      balance,
      supplierStoreId,
      gstType,
    } = createSupplierRequest;
    const createdCustomer = await SupplierModel.create({
      phoneNumber,
      addresses,
      email,
      gstin,
      name,
      photoUrl,
      storeId,
      balance,
      supplierStoreId,
      gstType,
    });
    return createdCustomer;
  }

  async getOrCreateCustomerByPhone(phoneNumber: string) {
    try {
      const customer = await CustomerModel.findOne({
        phoneNumber: phoneNumber,
      }).sort({
        createdAt: -1,
      });
      if (!customer) {
        const customerDocument = new CustomerModel({
          phoneNumber: phoneNumber,
        });
        return await customerDocument.save();
      }
      return customer;
    } catch (error) {
      console.log(
        "Error caught in AuthRepo: getOrCreateCustomerByPhone => ",
        error
      );
      return new ApiError("Some error occurred while customer creation", 500);
    }
  }

  async createCustomerParty(party: CreatePartyRequestI) {
    const customer = await this.getOrCreateCustomerByPhone(party.phoneNumber);
    if (customer instanceof ApiError) {
      return customer;
    }
    const address: AdrressesI = party.address.billingSameAsShipping
      ? {
          shipping: party.address.shipping,
          billingSameAsShipping: party.address.billingSameAsShipping,
        }
      : party.address;
    const customerStoreInfo = await this.createCustomerStoreInfo({
      ...party,
      customerId: customer._id,
      addresses: [address],
    });
    if (customerStoreInfo instanceof ApiError) {
      return customerStoreInfo;
    }
    return {
      ...customerStoreInfo?.toObject(),
      phoneNumber: customer.phoneNumber,
    };
  }

  async createSupplierParty(party: CreatePartyRequestI) {
    const supplierStore = await StoreModel.findOne({
      phoneNumber: party.phoneNumber,
    });
    const address: AdrressesI = party.address.billingSameAsShipping
      ? {
          shipping: party.address.shipping,
          billingSameAsShipping: party.address.billingSameAsShipping,
        }
      : party.address;
    if (supplierStore) {
      const supplier = await this.createSupplier({
        ...party,
        supplierStoreId: supplierStore._id,
        addresses: [address],
      });
      return supplier;
    } else {
      const supplier = await this.createSupplier({
        ...party,
      });
      return supplier;
    }
  }

  async createCustomerStoreInfo(customerStoreInfo: CustomerStoreInfoI) {
    const existingCustomerStoreInfo = await CustomerStoreInfoModel.findOne({
      customerId: customerStoreInfo.customerId,
      storeId: customerStoreInfo.storeId,
    }).sort({
      createdAt: -1,
    });
    if (existingCustomerStoreInfo) {
      return new ApiError(
        "Customer already exists with give phone number",
        400
      );
    }
    const {
      addresses,
      balance,
      cart,
      customerId,
      storeId,
      totalSpent,
      email,
      gstin,
      name,
      gstType,
    } = customerStoreInfo;
    const createdCustomerStoreInfo = await CustomerStoreInfoModel.create({
      addresses,
      balance,
      cart,
      customerId,
      storeId,
      totalSpent,
      email,
      gstin,
      name,
      gstType,
    });
    return createdCustomerStoreInfo;
  }

  async updateCustomer(
    customerId: Types.ObjectId,
    updateCustomerRequest: CustomerI
  ) {
    const {
      addresses,
      favouriteProducts,
      reviews,
      searchQueries,
      email,
      gstin,
      lastLogin,
      name,
      photoUrl,
    } = updateCustomerRequest;
    const updatedCustomer = await CustomerModel.findByIdAndUpdate(
      customerId,
      {
        addresses,
        favouriteProducts,
        reviews,
        searchQueries,
        email,
        gstin,
        lastLogin,
        name,
        photoUrl,
      },
      { new: true }
    );
    return updatedCustomer;
  }

  async updateCustomerStoreInfo(
    customerId: Types.ObjectId,
    customerStoreInfo: CustomerStoreInfoI
  ) {
    const {
      addresses,
      balance,
      cart,
      storeId,
      totalSpent,
      email,
      gstin,
      name,
      gstType,
    } = customerStoreInfo;
    const updatedCustomerStoreInfo =
      await CustomerStoreInfoModel.findOneAndUpdate(
        { customerId },
        {
          addresses,
          balance,
          cart,
          storeId,
          totalSpent,
          email,
          gstin,
          name,
          gstType,
        },
        { new: true }
      );
    return updatedCustomerStoreInfo;
  }
  async updateCustomerParty(party: UpdatePartyRequestI) {
    //this needs to support multiple addressed currently on one supported
    const addresses: Array<AdrressesI> = party.address ? [party.address] : [];
    const customerStoreInfo = await this.updateCustomerStoreInfo(
      party.partyId,
      {
        ...party,
        customerId: party.partyId,
        addresses,
      }
    );
    return customerStoreInfo;
  }

  async updateSupplier(
    supplierId: Types.ObjectId,
    updateSupplierRequest: SupplierI
  ) {
    const {
      phoneNumber,
      addresses,
      email,
      gstin,
      name,
      photoUrl,
      storeId,
      balance,
      supplierStoreId,
      gstType,
    } = updateSupplierRequest;
    const createdCustomer = await SupplierModel.findByIdAndUpdate(
      supplierId,
      {
        phoneNumber,
        addresses,
        email,
        gstin,
        name,
        photoUrl,
        storeId,
        balance,
        supplierStoreId,
        gstType,
      },
      { new: true }
    );
    return createdCustomer;
  }

  async updateSupplierParty(party: UpdatePartyRequestI) {
    //this needs to support multiple addressed currently on one supported
    const addresses: Array<AdrressesI> = party.address ? [party.address] : [];
    const supplier = await this.updateSupplier(party.partyId, {
      ...party,
      addresses,
    });
    return supplier;
  }

  async getStoreCustomerById(storeId: string, customerId: string) {
    try {
      const customer = await CustomerModel.findOne({
        _id: customerId,
      });
      const customerStoreInfo = await CustomerStoreInfoModel.findOne({
        storeId,
        customerId,
      });
      return { customer, customerStoreInfo };
    } catch (error) {
      const mongooseError = error as MongooseError;
      console.log(mongooseError.name);
      if (mongooseError.name === "CastError") {
        return new ApiError("Please pass valid customer id", 400);
      }
      return new ApiError(mongooseError.message, 500);
    }
  }

  getBalanceTotalMongoPipeline(storeId: string) {
    console.log(storeId);
    return [
      {
        $match: { storeId: new mongoose.Types.ObjectId(storeId) },
      },
      {
        $group: {
          _id: null,
          totalBalanceLessThanZero: {
            $sum: {
              $cond: [{ $lt: ["$balance", 0] }, "$balance", 0],
            },
          },
          totalBalanceGreaterThanZero: {
            $sum: {
              $cond: [{ $gt: ["$balance", 0] }, "$balance", 0],
            },
          },
        },
      },
    ];
  }

  async getStoreCustomersTotalBalance(storeId: string) {
    try {
      const pipeline = this.getBalanceTotalMongoPipeline(storeId);
      const result = await CustomerStoreInfoModel.aggregate(pipeline);
      console.log(result);
      if (result.length > 0) {
        return result[0];
      } else {
        return new ApiError(`No customers found for storeId ${storeId}.`, 400);
      }
    } catch (error) {
      const mongooseError = error as MongooseError;
      console.log(mongooseError.name);
      if (mongooseError.name === "CastError") {
        return new ApiError("Please pass valid customer id", 400);
      }
      return new ApiError(mongooseError.message, 500);
    }
  }

  async getStoreSuppliersTotalBalance(storeId: string) {
    try {
      const pipeline = this.getBalanceTotalMongoPipeline(storeId);
      const result = await SupplierModel.aggregate(pipeline);
      if (result.length > 0) {
        return result[0];
      } else {
        return new ApiError(`No customers found for storeId ${storeId}.`, 400);
      }
    } catch (error) {
      const mongooseError = error as MongooseError;
      console.log(mongooseError.name);
      if (mongooseError.name === "CastError") {
        return new ApiError("Please pass valid customer id", 400);
      }
      return new ApiError(mongooseError.message, 500);
    }
  }

  async getStoreSupplierById(storeId: string, supplierId: string) {
    try {
      const supplier = await SupplierModel.findOne({
        storeId,
        _id: supplierId,
      });
      return supplier;
    } catch (error) {
      const mongooseError = error as MongooseError;
      console.log(mongooseError.name);
      if (mongooseError.name === "CastError") {
        return new ApiError("Please pass valid customer id", 400);
      }
      return new ApiError(mongooseError.message, 500);
    }
  }

  async getAllStoreCustomers(
    storeId: string,
    page: number,
    pageSize: number,
    sort?: SortI,
    filterBy?: PartiesFilterByI
  ) {
    let sortBy: { [key: string]: SortOrder };
    if (!sort?.sortBy) {
      sortBy = { _id: -1 };
    } else {
      sortBy = { [sort.sortBy]: sort.sortOrder ? sort.sortOrder : "asc" };
    }
    console.log(sortBy);
    const skipCount = (page - 1) * pageSize;
    let query = CustomerStoreInfoModel.find().where({ storeId });
    let countQuery = CustomerStoreInfoModel.find().where({ storeId });
    if (filterBy?.balance) {
      const [operator, value] = filterBy.balance.split(",");
      let queryFilter = {};

      if (operator === "gt") {
        queryFilter = { $gt: parseFloat(value) };
      } else if (operator === "eq") {
        queryFilter =
          parseFloat(value) === 0
            ? { $in: [0, undefined] }
            : { $eq: parseFloat(value) };
      } else if (operator === "lt") {
        queryFilter = { $lt: parseFloat(value) };
      }
      query.where({ balance: queryFilter });
      countQuery.where({
        balance: queryFilter,
      });
    }
    const parties = await query
      .collation({ locale: "en", strength: 2 }) // Using English language rules with case-insensitivity
      .sort(sortBy)
      .skip(skipCount)
      .limit(pageSize)
      .populate("customerId")
      .exec();
    const totalCount = await countQuery.countDocuments().exec();
    const formattedParties = parties.map((party) => ({
      customer: party.customerId,
      customerStoreInfo: {
        ...party?.toObject(),
        customerId: party.customerId._id,
      },
    }));

    return { parties: formattedParties, totalCount };
  }

  async getAllStoreSuppliers(
    storeId: string,
    page: number,
    pageSize: number,
    sort?: SortI,
    filterBy?: PartiesFilterByI
  ) {
    let sortBy: { [key: string]: SortOrder };
    if (!sort?.sortBy) {
      sortBy = { _id: -1 };
    } else {
      sortBy = { [sort.sortBy]: sort.sortOrder ? sort.sortOrder : "asc" };
    }
    console.log(sortBy);
    const skipCount = (page - 1) * pageSize;
    let query = SupplierModel.find().where({ storeId });
    let countQuery = SupplierModel.find().where({ storeId });
    if (filterBy?.balance) {
      const [operator, value] = filterBy.balance.split(",");
      let queryFilter = {};

      if (operator === "gt") {
        queryFilter = { $gt: parseFloat(value) };
      } else if (operator === "eq") {
        queryFilter =
          parseFloat(value) === 0
            ? { $in: [0, undefined] }
            : { $eq: parseFloat(value) };
      } else if (operator === "lt") {
        queryFilter = { $lt: parseFloat(value) };
      }
      query.where({ balance: queryFilter });
      countQuery.where({
        balance: queryFilter,
      });
    }
    const parties = await query
      .collation({ locale: "en", strength: 2 }) // Using English language rules with case-insensitivity
      .sort(sortBy)
      .skip(skipCount)
      .limit(pageSize)
      .exec();
    const totalCount = await countQuery.countDocuments().exec();
    return { parties, totalCount };
  }
}
