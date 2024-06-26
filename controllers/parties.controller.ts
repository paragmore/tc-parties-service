import { inject, injectable } from "inversify";
import { PartiesService } from "../service/parties.service";
import {
  ApiError,
  ApiHelper,
  ApiHelperHandler,
  IReply,
} from "../utils/ApiHelper";
import {
  CreatePartyRequestI,
  DeletePartiesRequestI,
  GetAllStorePartiesParams,
  GetPartiesQueryParamsI,
  GetPartyByIdQueryParams,
  GetStoreTotalBalanceParams,
  PartyTypeEnum,
  UpdatePartyRequestI,
} from "../types/types";
import { isValidObjectId } from "mongoose";

@injectable()
export class PartiesController {
  constructor(@inject(PartiesService) private partiesService: PartiesService) {}
  createParty: ApiHelperHandler<CreatePartyRequestI, {}, {}, {}, IReply> =
    async (request, reply) => {
      const { body } = request;
      if (
        !body ||
        !body.storeId ||
        !body.name ||
        !body.phoneNumber ||
        !body.type ||
        !body.gstType
      ) {
        return ApiHelper.missingParameters(reply);
      }

      if (!Object.values(PartyTypeEnum).includes(body.type)) {
        return ApiHelper.callFailed(
          reply,
          "Please provide correct party type",
          400
        );
      }

      const isValidStoreId = isValidObjectId(body.storeId);
      if (!isValidStoreId) {
        return ApiHelper.callFailed(reply, "Please pass valid storeId", 400);
      }

      try {
        const response = await this.partiesService.createParty(body);
        if (response instanceof ApiError) {
          return ApiHelper.callFailed(reply, response.message, response.code);
        }
        return ApiHelper.success(reply, response);
      } catch (error) {
        //@ts-ignore
        return ApiHelper.callFailed(reply, error.message, 500);
      }
    };

  updateParty: ApiHelperHandler<UpdatePartyRequestI, {}, {}, {}, IReply> =
    async (request, reply) => {
      const { body } = request;
      if (!body || !body.partyId || !body.type) {
        return ApiHelper.missingParameters(reply);
      }

      if (!Object.values(PartyTypeEnum).includes(body.type)) {
        return ApiHelper.callFailed(
          reply,
          "Please provide correct party type",
          400
        );
      }

      const isValidPartyId = isValidObjectId(body.partyId);
      if (!isValidPartyId) {
        return ApiHelper.callFailed(reply, "Please pass valid PartyId", 400);
      }
      try {
        const response = await this.partiesService.updateParty(body);
        return ApiHelper.success(reply, response);
      } catch (error) {
        //@ts-ignore
        return ApiHelper.callFailed(reply, error.message, 500);
      }
    };

  softDeleteParties: ApiHelperHandler<
    DeletePartiesRequestI,
    {},
    {},
    {},
    IReply
  > = async (request, reply) => {
    const { body } = request;
    if (!body || !body.storeId || !body.type || !body.partyIds) {
      return ApiHelper.missingParameters(reply);
    }
    const isValidStoreId = isValidObjectId(body.storeId);
    if (!isValidStoreId) {
      return ApiHelper.callFailed(reply, "Please pass valid storeId", 400);
    }
    try {
      const deleteResponse = await this.partiesService.softDeleteParties(
        body.storeId,
        body.type,
        body.partyIds
      );
      if (deleteResponse instanceof ApiError) {
        return ApiHelper.callFailed(
          reply,
          deleteResponse.message,
          deleteResponse.code
        );
      }
      return ApiHelper.success(reply, deleteResponse);
    } catch (error) {
      //@ts-ignore
      return ApiHelper.callFailed(reply, error.message, 500);
    }
  };

  getAllStoreParties: ApiHelperHandler<
    {},
    GetPartiesQueryParamsI,
    {},
    GetAllStorePartiesParams,
    IReply
  > = async (request, reply) => {
    const { query, params } = request;
    const pageSize = (query.pageSize && parseInt(query.pageSize)) || 10;
    const page = (query.page && parseInt(query.page)) || 1;
    const nextPage = page + 1;
    const previousPage = page - 1;
    const { sortBy, sortOrder, balance } = query;

    if (!Object.values(PartyTypeEnum).includes(params.type)) {
      return ApiHelper.callFailed(
        reply,
        "Please provide correct party type",
        400
      );
    }

    const filterBy = {
      balance,
    };
    const partiesResponse = await this.partiesService.getAllStoreParties(
      params.storeId,
      params.type,
      page,
      pageSize,
      {
        sortBy,
        sortOrder,
      },
      filterBy
    );
    if (partiesResponse instanceof ApiError) {
      ApiHelper.callFailed(
        reply,
        partiesResponse.message,
        partiesResponse.code
      );
      return;
    }
    const response = {
      parties: partiesResponse.parties,
      pagination: {
        pageSize,
        page,
        nextPage,
        previousPage,
        totalPages: Math.ceil(partiesResponse.totalCount / pageSize),
        totalResults: partiesResponse.totalCount,
      },
    };
    ApiHelper.success(reply, response);
  };

  getStorePartyById: ApiHelperHandler<
    {},
    {},
    {},
    GetPartyByIdQueryParams,
    IReply
  > = async (request, reply) => {
    const { params } = request;
    const { partyId, storeId, type } = params;

    if (!Object.values(PartyTypeEnum).includes(type)) {
      return ApiHelper.callFailed(
        reply,
        "Please provide correct party type",
        400
      );
    }
    const isValidStoreId = isValidObjectId(storeId);
    if (!isValidStoreId) {
      return ApiHelper.callFailed(reply, "Please pass valid storeId", 400);
    }

    const isValidPartyId = isValidObjectId(partyId);
    if (!isValidPartyId) {
      return ApiHelper.callFailed(reply, "Please pass valid partyId", 400);
    }
    const partiesResponse = await this.partiesService.getStorePartyById(
      storeId,
      partyId,
      type
    );
    if (!partiesResponse) {
      return ApiHelper.success(
        reply,
        "Party with the given id not found in the store"
      );
    }
    if (partiesResponse instanceof ApiError) {
      return ApiHelper.callFailed(
        reply,
        partiesResponse.message,
        partiesResponse.code
      );
    }
    ApiHelper.success(reply, partiesResponse);
  };

  getStorePartiesTotalBalance: ApiHelperHandler<
    {},
    {},
    {},
    GetStoreTotalBalanceParams,
    IReply
  > = async (request, reply) => {
    const { params } = request;
    const { storeId, type } = params;

    if (!Object.values(PartyTypeEnum).includes(type)) {
      return ApiHelper.callFailed(
        reply,
        "Please provide correct party type",
        400
      );
    }
    const isValidStoreId = isValidObjectId(storeId);
    if (!isValidStoreId) {
      return ApiHelper.callFailed(reply, "Please pass valid storeId", 400);
    }

    const partiesResponse =
      await this.partiesService.getStorePartiesTotalBalance(storeId, type);
    if (!partiesResponse) {
      return ApiHelper.success(
        reply,
        "Party with the given id not found in the store"
      );
    }
    if (partiesResponse instanceof ApiError) {
      return ApiHelper.callFailed(
        reply,
        partiesResponse.message,
        partiesResponse.code
      );
    }
    ApiHelper.success(reply, partiesResponse);
  };
}
