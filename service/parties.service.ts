import { inject, injectable } from "inversify";
import { PartiesRepo } from "../repo/parties.repo";
import {
  CreatePartyRequestI,
  PartiesFilterByI,
  SortI,
  UpdatePartyRequestI,
} from "../types/types";
import { ApiError } from "../utils/ApiHelper";

@injectable()
export class PartiesService {
  constructor(@inject(PartiesRepo) private partiesRepo: PartiesRepo) {}

  async createParty(party: CreatePartyRequestI) {
    return await this.partiesRepo.createParty(party);
  }

  async updateParty(party: UpdatePartyRequestI) {
    // return await this.partiesRepo.updateParty(party.partyId, {
    //   ...party,
    //   unit: { name: party.unit },
    //   purchaseUnit,
    //   storeId: new Types.ObjectId(),
    //   slug: "",
    // });
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
