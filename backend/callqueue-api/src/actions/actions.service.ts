import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import type { AttendantRole } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { nowMs } from "../shared/utils/time";
import { pauseAttendant, resumeAttendant, finishCall } from "../domain/attendantTransitions";
import { startCall as startCallTransition } from "../domain/attendantTransitions";
import { selectNextAttendantCodeForCall } from "../domain/callRouting";

@Injectable()
export class ActionsService {
  constructor(private readonly prisma: PrismaService) {}

  async startCall() {
    const now = nowMs();

    return this.prisma.$transaction(async (tx) => {
      const attendants = await tx.attendant.findMany({
        select: {
          code: true,
          role: true,
          status: true,
          idleSince: true,
          handledCalls: true,
          statusSince: true,
          idleMs: true,
          callMs: true,
          pauseMs: true,
        },
      });

      const nextCode = selectNextAttendantCodeForCall(attendants, now);
      if (!nextCode) return { ok: false, reason: "NO_AVAILABLE_ATTENDANT" };

      const current = await tx.attendant.findUnique({ where: { code: nextCode } });
      if (!current) throw new NotFoundException("Atendente não encontrado.");

      if (current.status !== "AVAILABLE") {
        // outro request pode ter pegado antes
        return { ok: false, reason: "NOT_AVAILABLE" };
      }

      const updated = startCallTransition(current, now);

      await tx.attendant.update({
        where: { code: nextCode },
        data: {
          status: updated.status,
          statusSince: updated.statusSince,
          idleMs: updated.idleMs,
        },
      });

      return { ok: true, code: nextCode };
    });
  }

  async pause(code: string) {
    const now = nowMs();

    const attendant = await this.prisma.attendant.findUnique({ where: { code } });
    if (!attendant) throw new NotFoundException("Atendente não encontrado.");

    const updated = pauseAttendant(attendant, now);

    return this.prisma.attendant.update({
      where: { code },
      data: {
        status: updated.status,
        statusSince: updated.statusSince,
      },
    });
  }

  async resume(code: string) {
    const now = nowMs();

    const attendant = await this.prisma.attendant.findUnique({ where: { code } });
    if (!attendant) throw new NotFoundException("Atendente não encontrado.");

    const updated = resumeAttendant(attendant, now);

    return this.prisma.attendant.update({
      where: { code },
      data: {
        status: updated.status,
        statusSince: updated.statusSince,
        pauseMs: updated.pauseMs,
      },
    });
  }

  async finishCall(code: string) {
    const now = nowMs();

    const attendant = await this.prisma.attendant.findUnique({ where: { code } });
    if (!attendant) throw new NotFoundException("Atendente não encontrado.");

    const updated = finishCall(attendant, now);

    return this.prisma.attendant.update({
      where: { code },
      data: {
        status: updated.status,
        statusSince: updated.statusSince,
        callMs: updated.callMs,
        handledCalls: updated.handledCalls,
        idleSince: updated.idleSince,
        idleMs: updated.idleMs,
      },
    });
  }

  async setRole(code: string, role: AttendantRole) {
    if (!role) throw new BadRequestException("Role inválida.");

    const attendant = await this.prisma.attendant.findUnique({ where: { code } });
    if (!attendant) throw new NotFoundException("Atendente não encontrado.");

    return this.prisma.attendant.update({
      where: { code },
      data: { role },
    });
  }
}
