import { injectable } from "inversify";
import {
  CreatePartyRequestI,
  PartiesFilterByI,
  SortI,
  CustomerI,
  CustomerStoreInfoI,
} from "../types/types";
import { MongooseError, SortOrder, Types } from "mongoose";
import { CustomerModel } from "../models/customer.model";
import { ApiError } from "../utils/ApiHelper";

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

  async createSupplier(createSupplierRequest: SupplierI) {}

  async createCustomerParty(party: CreatePartyRequestI) {
    const customer = await this.createCustomer({
      phoneNumber: party.phoneNumber,
    });
    const customerStoreInfo = await this.createCustomerStoreInfo({
      ...party,
      customerId: customer._id,
    });
  }

  async createSupplierParty(party: CreatePartyRequestI) {
    const supplier = await this.createSupplier({
      phoneNumber: party.phoneNumber,
    });
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
    const createdCustomerStoreInfo = await CustomerModel.create({
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
  async createParty(party: CreatePartyRequestI) {
    // const { storeId, name } = party;
    // const createdParty = await PartyModel.create({
    //   storeId,
    //   name,
    // });
    // return createdParty;
  }

  async updateParty(id: Types.ObjectId, party: any) {
    // const {
    //   name,
    //   description,
    //   sellsPrice,
    //   purchasePrice,
    //   category,
    //   variants,
    //   heroImage,
    //   images,
    //   quantity,
    //   discounts,
    //   hsnCode,
    //   taxIncluded,
    //   unit,
    //   purchaseUnit,
    //   gstPercentage,
    //   deliveryTime,
    //   isInventory,
    //   inventoryParties,
    //   lowStock,
    // } = party;
    // const updatedParty = await PartyModel.findByIdAndUpdate(id, {
    //   name,
    //   description,
    //   sellsPrice,
    //   purchasePrice,
    //   category,
    //   variants,
    //   heroImage,
    //   images,
    //   quantity,
    //   discounts,
    //   hsnCode,
    //   taxIncluded,
    //   unit,
    //   purchaseUnit,
    //   gstPercentage,
    //   deliveryTime,
    //   isInventory,
    //   inventoryParties,
    //   lowStock,
    // });
    // return updatedParty;
  }
  async getStorePartyById(storeId: string, partyId: string) {
    // try {
    //   const party = await PartyModel.findOne({ storeId, _id: partyId });
    //   return party;
    // } catch (error) {
    //   const mongooseError = error as MongooseError;
    //   console.log(mongooseError.name);
    //   if (mongooseError.name === "CastError") {
    //     return new ApiError("Please pass valid party id", 400);
    //   }
    //   return new ApiError(mongooseError.message, 500);
    // }
  }

  async getAllStoreParties(
    storeId: string,
    page: number,
    pageSize: number,
    sort?: SortI,
    filterBy?: PartiesFilterByI
  ) {
    // let sortBy: { [key: string]: SortOrder };
    // if (!sort?.sortBy) {
    //   sortBy = { _id: -1 };
    // } else {
    //   sortBy = { [sort.sortBy]: sort.sortOrder ? sort.sortOrder : "asc" };
    // }
    // console.log(sortBy);
    // const skipCount = (page - 1) * pageSize;
    // let query = PartyModel.find().where({ storeId });
    // let countQuery = PartyModel.find().where({ storeId });
    // if (filterBy?.category && filterBy?.category?.length > 0) {
    //   query.where({ category: { $in: filterBy?.category } });
    //   countQuery.where({ category: { $in: filterBy?.category } });
    // }
    // const parties = await query
    //   .sort(sortBy)
    //   .skip(skipCount)
    //   .limit(pageSize)
    //   .exec();
    // const totalCount = await countQuery.countDocuments().exec();
    // return { parties, totalCount };
  }
}
