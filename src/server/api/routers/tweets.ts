import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const tweetsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ content: z.string().min(1).max(255) }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;
      const { content } = input;

      const tweet = await ctx.prisma.tweet.create({
        data: {
          content,
          creatorId: user.id,
        },
      });

      return tweet;
    }),
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;

      const tweets = await ctx.prisma.tweet.findMany({
        include: {
          creator: {
            select: {
              image: true,
              name: true,
              username: true,
            },
          },
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: limit + 1,
      });

      return tweets;
    }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;

      const tweet = await ctx.prisma.tweet.findUnique({
        include: {
          creator: {
            select: {
              image: true,
              name: true,
              username: true,
            },
          },
        },
        where: {
          id,
        },
      });

      return tweet;
    }),
});
