import { Module } from "@nestjs/common";
import { ActionsController } from "./actions.controller";
import { ActionsService } from "./actions.service";
import { PrismaModule } from "../prisma/prisma.module";
import { EventsModule } from "../events/events.module";

@Module({
  imports: [PrismaModule, EventsModule],
  controllers: [ActionsController],
  providers: [ActionsService],
})
export class ActionsModule {}
