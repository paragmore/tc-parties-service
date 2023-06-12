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
    });
    return createdCustomer;
  }

  async createCustomerParty(party: CreatePartyRequestI) {
    const customer = await this.createCustomer({
      phoneNumber: party.phoneNumber,
    });
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
    const updatedCustomer = await CustomerModel.findByIdAndUpdate(customerId, {
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
        }
      );
    return updatedCustomerStoreInfo;
  }
  async updateCustomerParty(party: UpdatePartyRequestI) {
    const customerStoreInfo = await this.updateCustomerStoreInfo(
      party.partyId,
      {
        ...party,
        customerId: party.partyId,
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
    } = updateSupplierRequest;
    const createdCustomer = await SupplierModel.findByIdAndUpdate(supplierId, {
      phoneNumber,
      addresses,
      email,
      gstin,
      name,
      photoUrl,
      storeId,
      balance,
      supplierStoreId,
    });
    return createdCustomer;
  }

  async updateSupplierParty(party: UpdatePartyRequestI) {
    const supplier = await this.updateSupplier(party.partyId, {
      ...party,
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
      let queryFilterString =
        operator === "gt"
          ? "$gt"
          : operator === "eq"
          ? "$eq"
          : operator === "lt"
          ? "$lt"
          : "";
      if (queryFilterString) {
        query.where({ balance: { [queryFilterString]: parseFloat(value) } });
        countQuery.where({
          balance: { [queryFilterString]: parseFloat(value) },
        });
      }
    }
    const parties = await query
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
      let queryFilterString =
        filterBy.balance === "gt"
          ? "$gt"
          : filterBy.balance === "eq"
          ? "$eq"
          : filterBy.balance === "lt"
          ? "$lt"
          : "";
      if (queryFilterString) {
        query.where({ balance: { [queryFilterString]: 0 } });
        countQuery.where({ balance: { [queryFilterString]: 0 } });
      }
    }
    const parties = await query
      .sort(sortBy)
      .skip(skipCount)
      .limit(pageSize)
      .exec();
    const totalCount = await countQuery.countDocuments().exec();
    return { parties, totalCount };
  }
}
