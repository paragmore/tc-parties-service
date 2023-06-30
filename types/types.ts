import { Document, Schema, SortOrder, Types } from "mongoose";

export interface UpdatePartyRequestI {
  partyId: Types.ObjectId;
  type: PartyTypeEnum;
  storeId: Types.ObjectId;
  phoneNumber: string;
  gstType: GSTTypeEnum;
  name?: string;
  tradeName?: string;
  email?: string;
  balance?: number;
  gstin?: string;
  address?: AdrressesI;
}

export interface DeletePartiesRequestI {
  storeId: string;
  type: PartyTypeEnum;
  partyIds: string[];
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
  tradeName?: string;
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
  tradeName?: string;
  balance?: number;
  gstin?: string;
  addresses?: Array<AdrressesI>;
  photoUrl?: string;
  storeId: Types.ObjectId;
  supplierStoreId?: Types.ObjectId;
  gstType: GSTTypeEnum;
}

export interface CustomerStoreInfoI {
  cart?: Types.ObjectId;
  totalSpent?: number;
  storeId: Types.ObjectId;
  balance?: number;
  email?: string;
  name?: string;
  tradeName?: string;
  addresses?: Array<AdrressesI>;
  customerId: Types.ObjectId;
  gstin?: string;
  gstType: GSTTypeEnum;
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
  tradeName?: string;
  phoneNumber: string;
  email?: string;
  balance?: number;
  gstin?: string;
  address: AdrressesI;
  gstType: GSTTypeEnum;
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

export interface GSTTypeI {
  title: string;
  subtitle: string;
  isGstin: boolean;
  enumValue: GSTTypeEnum;
}

export enum GSTTypeEnum {
  REGISTERED = "REGISTERED",
  REGISTERED_COMPOSITION = "REGISTERED_COMPOSITION",
  UNREGISTERED = "UNREGISTERED",
  CONSUMER = "CONSUMER",
  OVERSEAS = "OVERSEAS",
  SPECIAL_ECONOMIC_ZONE = "SPECIAL_ECONOMIC_ZONE",
  DEEMED_EXPORT = "DEEMED_EXPORT",
  TAX_DEDUCTOR = "TAX_DEDUCTOR",
  SEZ_DEVELOPER = "SEZ_DEVELOPER",
}

export const gstTypeList: Array<GSTTypeI> = [
  {
    title: "Registered Business - Regular",
    subtitle: "Business that is registered under GST",
    isGstin: true,
    enumValue: GSTTypeEnum.REGISTERED,
  },
  {
    title: "Registered Business - Composition",
    subtitle: "Business that is registered under the Composition Scheme GST",
    isGstin: true,
    enumValue: GSTTypeEnum.REGISTERED_COMPOSITION,
  },
  {
    title: "Unregistered Business",
    subtitle: "Business that has not been registered under GST",
    isGstin: false,
    enumValue: GSTTypeEnum.UNREGISTERED,
  },
  {
    title: "Consumer",
    subtitle: "A consumer who is a regular consumer",
    isGstin: false,
    enumValue: GSTTypeEnum.CONSUMER,
  },
  {
    title: "Overseas",
    subtitle:
      "Persons with whom you do import or export of supplies outside India",
    isGstin: false,
    enumValue: GSTTypeEnum.OVERSEAS,
  },
  {
    title: "Special Economic Zone",
    subtitle:
      "Business (Unit) that is located in a Special Economic Zone (SEZ) of India or a SEZ Developer",
    isGstin: true,
    enumValue: GSTTypeEnum.SPECIAL_ECONOMIC_ZONE,
  },
  {
    title: "Deemed Export",
    subtitle:
      "Supply of goods to an Export Oriented Unit or against Advanced Authorization/Export Promotion Capital Goods",
    isGstin: true,
    enumValue: GSTTypeEnum.DEEMED_EXPORT,
  },
  {
    title: "Tax Deductor",
    subtitle:
      "Departments of State/Central government, governmental agencies or local authorities",
    isGstin: true,
    enumValue: GSTTypeEnum.TAX_DEDUCTOR,
  },
  {
    title: "SEZ Developer",
    subtitle:
      "A person/organization who owns at least 26% of the equity in creating business units in Special Economic Zone (SEZ)",
    isGstin: true,
    enumValue: GSTTypeEnum.SEZ_DEVELOPER,
  },
];
