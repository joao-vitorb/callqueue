import { Module } from "@nestjs/common";
import { AttendantsModule } from "./attendants/attendants.module";

@Module({
  imports: [AttendantsModule],
})
export class AppModule {}
