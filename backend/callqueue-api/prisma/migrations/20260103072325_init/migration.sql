-- CreateTable
CREATE TABLE "Attendant" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "role" TEXT NOT NULL DEFAULT 'DEFAULT',
    "joinedAt" BIGINT NOT NULL,
    "statusSince" BIGINT NOT NULL,
    "idleSince" BIGINT NOT NULL,
    "idleMs" BIGINT NOT NULL DEFAULT 0,
    "callMs" BIGINT NOT NULL DEFAULT 0,
    "pauseMs" BIGINT NOT NULL DEFAULT 0,
    "handledCalls" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
