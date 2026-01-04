import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AttendantsService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    return this.prisma.attendant.findMany({ orderBy: { code: "asc" } });
  }

  async createRandom() {
    // TODO: gerar nome/sobrenome
    // TODO: gerar code 01-50 sem repetir
    // TODO: criar timestamps e salvar no DB
    throw new Error("TODO");
  }

  async remove(code: string) {
    // TODO: remover atendente
    throw new Error("TODO");
  }
}
