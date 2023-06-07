import { injectable } from "inversify";
import {
  CreateCategoryRequestI,
  CreatePartyRequestI,
  PartyI,
  PartiesFilterByI,
  SortI,
} from "../types/types";
import { PartyModel } from "../models/supplier.model";
import { MongooseError, SortOrder, Types } from "mongoose";
import { CategoryModel } from "../models/customer.model";
import { ApiError } from "../utils/ApiHelper";

@injectable()
export class PartiesRepo {
  constructor() {}
  async getStorePartyBySlug(storeId: Types.ObjectId, slug: string) {
    const party = await PartyModel.findOne({ storeId, slug });
    return party;
  }
  async createParty(party: PartyI) {
    const {
      storeId,
      name,
      description,
      sellsPrice,
      purchasePrice,
      category,
      variants,
      heroImage,
      images,
      quantity,
      discounts,
      hsnCode,
      taxIncluded,
      unit,
      purchaseUnit,
      gstPercentage,
      deliveryTime,
      slug,
      isInventory,
      inventoryParties,
      lowStock,
    } = party;

    const createdParty = await PartyModel.create({
      storeId,
      name,
      description,
      sellsPrice,
      purchasePrice,
      category,
      variants,
      heroImage,
      images,
      quantity,
      discounts,
      hsnCode,
      taxIncluded,
      unit,
      purchaseUnit,
      gstPercentage,
      deliveryTime,
      slug,
      isInventory,
      inventoryParties,
      lowStock,
    });

    return createdParty;
  }

  async updateParty(id: Types.ObjectId, party: PartyI) {
    const {
      name,
      description,
      sellsPrice,
      purchasePrice,
      category,
      variants,
      heroImage,
      images,
      quantity,
      discounts,
      hsnCode,
      taxIncluded,
      unit,
      purchaseUnit,
      gstPercentage,
      deliveryTime,
      isInventory,
      inventoryParties,
      lowStock,
    } = party;

    const updatedParty = await PartyModel.findByIdAndUpdate(id, {
      name,
      description,
      sellsPrice,
      purchasePrice,
      category,
      variants,
      heroImage,
      images,
      quantity,
      discounts,
      hsnCode,
      taxIncluded,
      unit,
      purchaseUnit,
      gstPercentage,
      deliveryTime,
      isInventory,
      inventoryParties,
      lowStock,
    });

    return updatedParty;
  }

  async createCategory(category: CreateCategoryRequestI) {
    const { storeId, name, description, slug } = category;
    try {
      const createdCategory = await CategoryModel.create({
        storeId,
        name,
        description,
        slug,
      });

      return createdCategory;
    } catch (error) {
      const mongooseError = error as MongooseError;
      console.log(mongooseError);
      console.log(mongooseError.name);

      if (mongooseError.message.includes("duplicate key")) {
        return new ApiError("Category with same name already exists", 400);
      }
      return new ApiError(mongooseError.message, 500);
    }
  }

  async getStorePartyById(storeId: string, partyId: string) {
    try {
      const party = await PartyModel.findOne({ storeId, _id: partyId });
      return party;
    } catch (error) {
      const mongooseError = error as MongooseError;
      console.log(mongooseError.name);
      if (mongooseError.name === "CastError") {
        return new ApiError("Please pass valid party id", 400);
      }
      return new ApiError(mongooseError.message, 500);
    }
  }

  async getStoreCategoryById(storeId: string, categoryId: string) {
    try {
      const category = await CategoryModel.findOne({
        storeId,
        _id: categoryId,
      });
      return category;
    } catch (error) {
      const mongooseError = error as MongooseError;
      console.log(mongooseError.name);
      if (mongooseError.name === "CastError") {
        return new ApiError("Please pass valid category id", 400);
      }
      return new ApiError(mongooseError.message, 500);
    }
  }

  async getAllStoreParties(
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
    let query = PartyModel.find().where({ storeId });
    let countQuery = PartyModel.find().where({ storeId });
    if (filterBy?.category && filterBy?.category?.length > 0) {
      query.where({ category: { $in: filterBy?.category } });
      countQuery.where({ category: { $in: filterBy?.category } });
    }

    const parties = await query
      .sort(sortBy)
      .skip(skipCount)
      .limit(pageSize)
      .exec();

    const totalCount = await countQuery.countDocuments().exec();

    return { parties, totalCount };
  }

  async getAllStoreCategories(
    storeId: string,
    page: number,
    pageSize: number,
    sort?: SortI
  ) {
    let sortBy: { [key: string]: SortOrder };
    if (!sort?.sortBy) {
      sortBy = { _id: -1 };
    } else {
      sortBy = { [sort.sortBy]: sort.sortOrder ? sort.sortOrder : "asc" };
    }
    console.log(sortBy);
    const skipCount = (page - 1) * pageSize;
    let query = CategoryModel.find().where({ storeId });
    let countQuery = CategoryModel.find().where({ storeId });
    const categories = await query
      .sort(sortBy)
      .skip(skipCount)
      .limit(pageSize)
      .exec();

    const totalCount = await countQuery.countDocuments().exec();

    return { categories, totalCount };
  }
}
