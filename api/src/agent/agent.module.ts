import { Module } from "@nestjs/common";
import { AgentController } from "./controller/agent.controller";
import { AgentService } from "./service/agent.service";
import { AgentRepository } from "./repository/agent.repository";
import { CommomModule } from "src/common/commom.module";
import { PropertyRepository } from "src/property/property/repository/property.repository";

@Module({
  controllers: [AgentController],
  providers: [AgentService, AgentRepository, PropertyRepository],
  imports: [CommomModule],
})
export class AgentModule { }

