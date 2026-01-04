import { Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { AttendantsService } from "./attendants.service";

@Controller("attendants")
export class AttendantsController {
  constructor(private readonly service: AttendantsService) {}

  @Get()
  async list() {
    return this.service.list();
  }

  @Post()
  async create() {
    return this.service.createRandom();
  }

  @Delete(":code")
  async remove(@Param("code") code: string) {
    return this.service.remove(code);
  }
}
