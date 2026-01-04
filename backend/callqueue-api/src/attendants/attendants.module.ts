import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { AttendantsController } from "./attendants.controller";
import { AttendantsService } from "./attendants.service";

@Module({
  imports: [PrismaModule],
  controllers: [AttendantsController],
  providers: [AttendantsService],
})
export class AttendantsModule {}
