import { Document, Schema, SortOrder, Types } from "mongoose";

export interface UpdatePartyRequestI {
  partyId: Types.ObjectId;
  type: PartyTypeEnum;
  storeId: Types.ObjectId;
  phoneNumber: string;
  name?: string;
  email?: string;
  balance?: number;
  gstin?: string;
  address?: AdrressesI;
}

export enum PartyTypeEnum {
  CUSTOMER = "customer",
  SUPPLIER = "supplier",
}

export interface SearchQueryI {
  searchTerm: string;
  storeId: Types.ObjectId;
}

export interface CustomerI {
  phoneNumber: string;
  name?: string;
  email?: string;
  gstin?: string;
  addresses?: Array<AdrressesI>;
  photoUrl?: string;
  lastLogin?: Date;
  searchQueries?: Array<SearchQueryI>;
  reviews?: Array<Types.ObjectId>;
  favouriteProducts?: Array<Types.ObjectId>;
}

export interface SupplierI {
  phoneNumber: string;
  email?: string;
  name?: string;
  balance?: number;
  gstin?: string;
  addresses?: Array<AdrressesI>;
  photoUrl?: string;
  storeId: Types.ObjectId;
  supplierStoreId?: Types.ObjectId;
}

export interface CustomerStoreInfoI {
  cart?: Types.ObjectId;
  totalSpent?: number;
  storeId: Types.ObjectId;
  balance?: number;
  email?: string;
  name?: string;
  addresses?: Array<AdrressesI>;
  customerId: Types.ObjectId;
  gstin?: string;
}

export interface AdrressesI {
  shipping: AddressI;
  billingSameAsShipping: boolean;
  billing?: AddressI;
}
export interface AddressI {
  line1: string;
  line2: string;
  city: string;
  state: string;
  pinCode: string;
}
export interface CreatePartyRequestI {
  type: PartyTypeEnum;
  storeId: Types.ObjectId;
  name: string;
  phoneNumber: string;
  email?: string;
  balance?: number;
  gstin?: string;
  address: AdrressesI;
}

export interface GetPartyByIdQueryParams {
  storeId: string;
  partyId: string;
  type: PartyTypeEnum;
}

export interface GetStoreTotalBalanceParams {
  storeId: string;
  type: PartyTypeEnum;
}

export interface PartiesFilterByI {
  balance?: string;
}

export interface PartiesFilterByQueryI {
  balance?: string;
}

export interface SortI {
  sortBy: string | undefined;
  sortOrder: SortOrder | undefined;
}
export interface GetPartiesQueryParamsI
  extends PartiesFilterByQueryI,
    PaginationQueryParamsI {}

export interface PaginationQueryParamsI {
  pageSize?: string;
  page?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface GetAllStorePartiesParams {
  storeId: string;
  type: PartyTypeEnum;
}
