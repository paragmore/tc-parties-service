import { FastifyInstance } from "fastify";
import partiesRoutes from "./routes/parties.routes";
export default async (app: FastifyInstance) => {
  app.register(partiesRoutes, { prefix: "/parties" });
};
