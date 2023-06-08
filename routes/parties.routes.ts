import "reflect-metadata";
import { FastifyInstance } from "fastify";
import { PartiesController } from "../controllers/parties.controller";
import container from "../inversify.config";
import { ApiHelper } from "../utils/ApiHelper";
import {
  CreatePartyRequestI,
  GetCategoriesQueryParamsI,
  GetPartiesQueryParamsI,
  UpdatePartyRequestI,
} from "../types/types";

export default async (app: FastifyInstance) => {
  const partiesController =
    container.resolve<PartiesController>(PartiesController);

  ApiHelper.put<UpdatePartyRequestI, {}, {}, {}>(
    app,
    "/update",
    partiesController.updateParty.bind(partiesController)
  );

  ApiHelper.post<CreatePartyRequestI, {}, {}, {}>(
    app,
    "/create",
    partiesController.createParty.bind(partiesController)
  );

  ApiHelper.get<GetCategoriesQueryParamsI, { storeId: string }, {}>(
    app,
    "/category/:storeId",
    partiesController.getAllStoreCategories.bind(partiesController)
  );

  ApiHelper.get<GetPartiesQueryParamsI, { storeId: string }, {}>(
    app,
    "/:storeId",
    partiesController.getAllStoreParties.bind(partiesController)
  );

  ApiHelper.get<{}, { storeId: string; partyId: string }, {}>(
    app,
    "/:storeId/:partyId",
    partiesController.getStorePartyById.bind(partiesController)
  );

  ApiHelper.get<{}, { storeId: string; categoryId: string }, {}>(
    app,
    "/category/:storeId/:categoryId",
    partiesController.getStoreCategoryById.bind(partiesController)
  );
};
