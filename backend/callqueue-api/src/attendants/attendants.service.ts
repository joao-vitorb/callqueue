import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { generateUniqueName } from "../shared/utils/names";
import { getNextAvailableCode } from "../shared/utils/attendantCode";

function nowMs(): bigint {
  return BigInt(Date.now());
}

@Injectable()
export class AttendantsService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    return this.prisma.attendant.findMany({ orderBy: { code: "asc" } });
  }

  async createRandom() {
    const existing = await this.prisma.attendant.findMany({
      select: { code: true, firstName: true, lastName: true },
      orderBy: { code: "asc" },
    });

    const nextCode = getNextAvailableCode(existing);
    if (!nextCode) {
      throw new BadRequestException("Limite máximo de 50 atendentes atingido.");
    }

    const name = generateUniqueName(
      existing.map((a) => ({ firstName: a.firstName, lastName: a.lastName }))
    );

    const createdAt = nowMs();

    return this.prisma.attendant.create({
      data: {
        code: nextCode,
        firstName: name.firstName,
        lastName: name.lastName,
        status: "AVAILABLE",
        role: "DEFAULT",
        joinedAt: createdAt,
        statusSince: createdAt,
        idleSince: createdAt,
        idleMs: 0n,
        callMs: 0n,
        pauseMs: 0n,
        handledCalls: 0,
      },
    });
  }

  async remove(code: string) {
    // TODO: implementar logout
    throw new Error("TODO");
  }
}
