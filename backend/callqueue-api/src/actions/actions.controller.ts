import { Body, Controller, Param, Post } from "@nestjs/common";
import type { AttendantRole } from "@prisma/client";
import { ActionsService } from "./actions.service";

@Controller("actions")
export class ActionsController {
  constructor(private readonly service: ActionsService) {}

  @Post("start-call")
  async startCall() {
    return this.service.startCall();
  }

  @Post("pause/:code")
  async pause(@Param("code") code: string) {
    return this.service.pause(code);
  }

  @Post("resume/:code")
  async resume(@Param("code") code: string) {
    return this.service.resume(code);
  }

  @Post("finish-call/:code")
  async finishCall(@Param("code") code: string) {
    return this.service.finishCall(code);
  }

  @Post("set-role/:code")
  async setRole(@Param("code") code: string, @Body() body: { role: AttendantRole }) {
    return this.service.setRole(code, body.role);
  }
}
