import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export type AppContext = { prisma: PrismaClient };

export const buildContext = (): AppContext => ({ prisma });
