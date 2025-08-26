import type { PrismaClient } from '@prisma/client';
import { z } from 'zod';

type Ctx = { prisma: PrismaClient };

const AddMovie = z.object({
  title: z.string().trim().min(1, 'title required'),
  note: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v && v.length ? v : undefined)),
});

export const movieResolvers = {
  Query: {
    movies: async (
      _parent: unknown,
      args: { filter?: 'all' | 'pending' | 'watched' },
      { prisma }: Ctx
    ) => {
      const where =
        args.filter === 'watched'
          ? { watched: true }
          : args.filter === 'pending'
          ? { watched: false }
          : {};
      return prisma.movie.findMany({ where, orderBy: { createdAt: 'asc' } });
    },
    movie: (_: unknown, args: { id: string }, { prisma }: Ctx) =>
      prisma.movie.findUnique({ where: { id: args.id } }),
  },

  Mutation: {
    addMovie: async (_: unknown, args: { input: { title: string; note?: string } }, { prisma }: Ctx) => {
      const input = AddMovie.parse(args.input);
      return prisma.movie.create({ data: { title: input.title, note: input.note } });
    },

    toggleWatched: async (_: unknown, { id }: { id: string }, { prisma }: Ctx) => {
      const current = await prisma.movie.findUniqueOrThrow({ where: { id } });
      return prisma.movie.update({ where: { id }, data: { watched: !current.watched } });
    },

    setWatched: (_: unknown, { id, watched }: { id: string; watched: boolean }, { prisma }: Ctx) =>
      prisma.movie.update({ where: { id }, data: { watched } }),

    deleteMovie: async (_: unknown, { id }: { id: string }, { prisma }: Ctx) => {
      await prisma.movie.delete({ where: { id } }).catch(() => null);
      return true;
    },

    clearWatched: async (_: unknown, __: unknown, { prisma }: Ctx) => {
      const res = await prisma.movie.deleteMany({ where: { watched: true } });
      return res.count;
    },
  },
};
