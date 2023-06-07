import { inject, injectable } from "inversify";
import { PartiesRepo } from "../repo/parties.repo";
import {
  CreateCategoryRequestI,
  CreatePartyRequestI,
  PartiesFilterByI,
  SortI,
  UnitI,
  UpdatePartyRequestI,
} from "../types/types";
import slugify from "slugify";
import { ApiError } from "../utils/ApiHelper";
import { Types } from "mongoose";

@injectable()
export class PartiesService {
  constructor(@inject(PartiesRepo) private partiesRepo: PartiesRepo) {}

  async createParty(party: CreatePartyRequestI) {
    const { name, storeId } = party;
    //convert the name to a unique slug
    let slug = slugify(name, { lower: true });
    const partyWithSameSlug = await this.partiesRepo.getStorePartyBySlug(
      storeId,
      slug
    );
    if (partyWithSameSlug) {
      //append timestamp to make it unique
      slug = `${slug}-${new Date().getTime()}`;
    }
    let purchaseUnit: UnitI | undefined =
      party.purchaseUnitName && party.purchaseUnitConversion
        ? {
            name: party.purchaseUnitName,
            conversion: party.purchaseUnitConversion,
          }
        : undefined;
    return await this.partiesRepo.createParty({
      ...party,
      slug,
      unit: { name: party.unit },
      purchaseUnit,
    });
  }

  async updateParty(party: UpdatePartyRequestI) {
    let purchaseUnit: UnitI | undefined =
      party.purchaseUnitName && party.purchaseUnitConversion
        ? {
            name: party.purchaseUnitName,
            conversion: party.purchaseUnitConversion,
          }
        : undefined;
    return await this.partiesRepo.updateParty(party.partyId, {
      ...party,
      unit: { name: party.unit },
      purchaseUnit,
      storeId: new Types.ObjectId(),
      slug: "",
    });
  }

  async createCategory(category: CreateCategoryRequestI) {
    const { name } = category;
    //convert the name to a unique slug
    let slug = slugify(name, { lower: true });
    return await this.partiesRepo.createCategory({ ...category, slug });
  }

  async getStorePartyById(storeId: string, partyId: string) {
    try {
      const response = await this.partiesRepo.getStorePartyById(
        storeId,
        partyId
      );
      return response;
    } catch (error) {
      console.log("getAllStoreParties service", error);
      return new ApiError("Something went wrong, Please try again", 500);
    }
  }

  async getStoreCategoryById(storeId: string, categoryId: string) {
    try {
      const response = await this.partiesRepo.getStoreCategoryById(
        storeId,
        categoryId
      );
      return response;
    } catch (error) {
      console.log("getStoreCategoryById service", error);
      return new ApiError("Something went wrong, Please try again", 500);
    }
  }

  async getAllStoreParties(
    storeId: string,
    page: number,
    pageSize: number,
    sort?: SortI,
    filterBy?: PartiesFilterByI
  ) {
    try {
      const response = await this.partiesRepo.getAllStoreParties(
        storeId,
        page,
        pageSize,
        sort,
        filterBy
      );
      return response;
    } catch (error) {
      console.log("getAllStoreParties service", error);
      return new ApiError("Something went wrong, Please try again", 500);
    }
  }

  async getAllStoreCategories(
    storeId: string,
    page: number,
    pageSize: number,
    sort?: SortI
  ) {
    try {
      const response = await this.partiesRepo.getAllStoreCategories(
        storeId,
        page,
        pageSize,
        sort
      );
      return response;
    } catch (error) {
      console.log("getAllStoreCategories service", error);
      return new ApiError("Something went wrong, Please try again", 500);
    }
  }
}
