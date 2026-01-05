import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { AttendantsController } from "./attendants.controller";
import { AttendantsService } from "./attendants.service";
import { EventsModule } from "src/events/events.module";

@Module({
  imports: [PrismaModule, EventsModule],
  controllers: [AttendantsController],
  providers: [AttendantsService],
})
export class AttendantsModule {}
