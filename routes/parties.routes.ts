import "reflect-metadata";
import { FastifyInstance } from "fastify";
import { PartiesController } from "../controllers/parties.controller";
import container from "../inversify.config";
import { ApiHelper } from "../utils/ApiHelper";
import {
  CreatePartyRequestI,
  GetCategoriesQueryParamsI,
  GetPartiesQueryParamsI,
  GetPartyByIdQueryParams,
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

  ApiHelper.get<GetPartiesQueryParamsI, { storeId: string }, {}>(
    app,
    "/:storeId",
    partiesController.getAllStoreParties.bind(partiesController)
  );

  ApiHelper.get<{}, GetPartyByIdQueryParams, {}>(
    app,
    "/:storeId/:type/:partyId",
    partiesController.getStorePartyById.bind(partiesController)
  );
};
