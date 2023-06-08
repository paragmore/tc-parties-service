import "reflect-metadata";
import { Container } from "inversify";
import { PartiesController } from "./controllers/parties.controller";
import { PartiesRepo } from "./repo/parties.repo";
import { PartiesService } from "./service/parties.service";

const container = new Container();

container.bind<PartiesService>(PartiesService).toSelf();
container.bind<PartiesRepo>(PartiesRepo).toSelf();
container.bind<PartiesController>(PartiesController).toSelf();

export default container;
