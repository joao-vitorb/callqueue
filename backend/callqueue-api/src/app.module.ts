import { Module } from "@nestjs/common";
import { AttendantsModule } from "./attendants/attendants.module";
import { ActionsModule } from "./actions/actions.module";

@Module({
  imports: [AttendantsModule, ActionsModule],
})
export class AppModule {}
