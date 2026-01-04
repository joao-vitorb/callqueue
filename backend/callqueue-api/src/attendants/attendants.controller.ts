import { Controller, Get } from "@nestjs/common";
import { AttendantsService } from "./attendants.service";

@Controller("attendants")
export class AttendantsController {
  constructor(private readonly service: AttendantsService) {}

  @Get()
  async list() {
    return this.service.list();
  }
}
