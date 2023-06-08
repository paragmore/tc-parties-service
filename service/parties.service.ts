import { inject, injectable } from "inversify";
import { PartiesRepo } from "../repo/parties.repo";
import {
  CreatePartyRequestI,
  PartiesFilterByI,
  PartyTypeEnum,
  SortI,
  UpdatePartyRequestI,
} from "../types/types";
import { ApiError } from "../utils/ApiHelper";

@injectable()
export class PartiesService {
  constructor(@inject(PartiesRepo) private partiesRepo: PartiesRepo) {}

  async createParty(party: CreatePartyRequestI) {
    const { type } = party;
    if (type === PartyTypeEnum.CUSTOMER) {
      return await this.partiesRepo.createCustomerParty(party);
    }
    if (type === PartyTypeEnum.SUPPLIER) {
      return await this.partiesRepo.createSupplierParty(party);
    }
    return new ApiError("Party Type not found", 500);
  }

  async updateParty(party: UpdatePartyRequestI) {
    const { type } = party;
    if (type === PartyTypeEnum.CUSTOMER) {
      return await this.partiesRepo.updateCustomerParty(party);
    }
    if (type === PartyTypeEnum.SUPPLIER) {
      return await this.partiesRepo.updateSupplierParty(party);
    }
    return new ApiError("Party Type not found", 500);
  }

  async getStorePartyById(
    storeId: string,
    partyId: string,
    type: PartyTypeEnum
  ) {
    try {
      if (type === PartyTypeEnum.CUSTOMER) {
        return await this.partiesRepo.getStoreCustomerById(storeId, partyId);
      }
      if (type === PartyTypeEnum.SUPPLIER) {
        return await this.partiesRepo.getStoreSupplierById(storeId, partyId);
      }
      return new ApiError("Party Type not found", 500);
    } catch (error) {
      console.log("getAllStoreParties service", error);
      return new ApiError("Something went wrong, Please try again", 500);
    }
  }

  async getAllStoreParties(
    storeId: string,
    type: PartyTypeEnum,
    page: number,
    pageSize: number,
    sort?: SortI,
    filterBy?: PartiesFilterByI
  ) {
    try {
      if (type === PartyTypeEnum.CUSTOMER) {
        return await this.partiesRepo.getAllStoreCustomers(
          storeId,
          page,
          pageSize,
          sort,
          filterBy
        );
      }
      if (type === PartyTypeEnum.SUPPLIER) {
        return await this.partiesRepo.getAllStoreSuppliers(
          storeId,
          page,
          pageSize,
          sort,
          filterBy
        );
      }
      return new ApiError("Party Type not found", 500);
    } catch (error) {
      console.log("getAllStoreParties service", error);
      return new ApiError("Something went wrong, Please try again", 500);
    }
  }
}
