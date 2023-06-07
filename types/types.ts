import { Document, Schema, SortOrder, Types } from "mongoose";

interface VariantPropertiesI {
  [key: string]: string;
}

interface VariantI {
  properties: VariantPropertiesI;
  stockQuantity: number;
  sellsPrice?: number;
  skuId?: number;
  discounts?: DiscountI[];
  imageUrls?: string[];
}

interface UnitI {
  quantity?: number;
  name: string;
  conversion?: number;
}
interface DiscountI {
  type: "percentage" | "amount";
  code: string;
  minType: "orderQuantity" | "orderValue";
  value: number;
  minimum?: number;
  maxDiscount?: number;
}

interface PartyI {
  storeId: Types.ObjectId;
  name: string;
  description?: string;
  sellsPrice: number;
  purchasePrice?: number;
  category?: Types.ObjectId[];
  variants?: VariantI[];
  heroImage?: string;
  images?: string[];
  slug: string;
  quantity: number;
  discounts?: DiscountI[];
  hsnCode?: string;
  taxIncluded?: boolean;
  unit: UnitI;
  purchaseUnit?: UnitI;
  gstPercentage?: number;
  deliveryTime?: string;
  isInventory?: boolean;
  inventoryParties?: InventoryPartyI[];
  lowStock?: number;
}

export interface InventoryPartyI {
  partyId: Types.ObjectId;
  amountConsumed: number;
}

interface PartyDocument extends Document, PartyI {}

export {
  VariantPropertiesI,
  VariantI,
  UnitI,
  DiscountI,
  PartyI,
  PartyDocument,
};

export interface CategoryI {
  name: string;
  description: string;
  storeId: Types.ObjectId;
  slug?: string;
}

export interface CreateCategoryRequestI extends CategoryI {}

export interface UpdatePartyRequestI {
  partyId: Types.ObjectId;
  name: string;
  description?: string;
  sellsPrice: number;
  purchasePrice?: number;
  category: Types.ObjectId[];
  variants?: VariantI[];
  heroImage?: string;
  images?: string[];
  quantity: number;
  discounts?: DiscountI[];
  hsnCode?: string;
  taxIncluded?: boolean;
  unit: string;
  purchaseUnitName?: string;
  purchaseUnitConversion?: number;
  gstPercentage?: number;
  deliveryTime?: string;
  isInventory?: boolean;
  inventoryParties?: InventoryPartyI[];
  lowStock?: number;
}
export interface CreatePartyRequestI {
  storeId: Types.ObjectId;
  name: string;
  description?: string;
  sellsPrice: number;
  purchasePrice?: number;
  category: Types.ObjectId[];
  variants?: VariantI[];
  heroImage?: string;
  images?: string[];
  quantity: number;
  discounts?: DiscountI[];
  hsnCode?: string;
  taxIncluded?: boolean;
  unit: string;
  purchaseUnitName?: string;
  purchaseUnitConversion?: number;
  gstPercentage?: number;
  deliveryTime?: string;
  isInventory?: boolean;
  inventoryParties?: InventoryPartyI[];
  lowStock?: number;
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
