import "reflect-metadata";
import { FastifyInstance } from "fastify";
import { PartiesController } from "../controllers/parties.controller";
import container from "../inversify.config";
import { ApiHelper } from "../utils/ApiHelper";
import {
  CreatePartyRequestI,
  GetAllStorePartiesParams,
  GetPartiesQueryParamsI,
  GetPartyByIdQueryParams,
  GetStoreTotalBalanceParams,
  UpdatePartyRequestI,
} from "../types/types";

export default async (app: FastifyInstance) => {
  const partiesController =
    container.resolve<PartiesController>(PartiesController);

  ApiHelper.post<CreatePartyRequestI, {}, {}, {}>(
    app,
    "/create",
    partiesController.createParty.bind(partiesController)
  );

  ApiHelper.put<UpdatePartyRequestI, {}, {}, {}>(
    app,
    "/update",
    partiesController.updateParty.bind(partiesController)
  );

  ApiHelper.get<GetPartiesQueryParamsI, GetAllStorePartiesParams, {}>(
    app,
    "/:storeId/:type",
    partiesController.getAllStoreParties.bind(partiesController)
  );

  ApiHelper.get<{}, GetPartyByIdQueryParams, {}>(
    app,
    "/:storeId/:type/:partyId",
    partiesController.getStorePartyById.bind(partiesController)
  );

  ApiHelper.get<{}, GetStoreTotalBalanceParams, {}>(
    app,
    "/balance/:storeId/:type",
    partiesController.getStorePartiesTotalBalance.bind(partiesController)
  );
};
