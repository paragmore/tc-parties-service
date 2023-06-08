import { Document, Schema, SortOrder, Types } from "mongoose";

export interface UpdatePartyRequestI {}

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
  name: string;
  email?: string;
  gstin?: string;
  addresses: Array<AdrressesI>;
  photoUrl?: string;
  lastLogin?: Date;
  searchQueries: Array<SearchQueryI>;
  reviews: Array<Types.ObjectId>;
  favouriteProducts: Array<Types.ObjectId>;
}

export interface CustomerStoreInfo {
  cart: Types.ObjectId;
  totalSpent: number;
  storeId: Types.ObjectId;
  balance: number;
  email?: string;
  name?: string;
  addresses: Array<AdrressesI>;
  customer: Types.ObjectId;
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

export interface PartiesFilterByI {
  category?: string[];
  minSellsPrice?: number;
  maxSellsPrice?: number;
  minPurchasePrice?: number;
  maxPurchasePrice?: number;
  minQuantity?: number;
  maxQuantity?: number;
}

export interface PartiesFilterByQueryI {
  category?: string;
  minSellsPrice?: number;
  maxSellsPrice?: number;
  minPurchasePrice?: number;
  maxPurchasePrice?: number;
  minQuantity?: number;
  maxQuantity?: number;
}

export interface SortI {
  sortBy: string | undefined;
  sortOrder: SortOrder | undefined;
}
export interface GetPartiesQueryParamsI
  extends PartiesFilterByQueryI,
    PaginationQueryParamsI {}

export interface GetCategoriesQueryParamsI extends PaginationQueryParamsI {}

export interface PaginationQueryParamsI {
  pageSize?: string;
  page?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
}
