import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const tweetsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1).max(255),
        parentId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;
      const { content, parentId } = input;

      const tweet = await ctx.prisma.tweet.create({
        data: {
          content,
          creatorId: user.id,
          parentId,
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
        where: {
          parentId: null,
        },
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
          replies: {
            include: {
              creator: true,
            },
          },
        },
        where: {
          id,
        },
      });

      return tweet;
    }),
  getInfinitePublicFeed: publicProcedure
    .input(
      z.object({
        cursor: z.object({ createdAt: z.date(), id: z.string() }).nullish(),
        limit: z.number().min(1).max(100).nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor } = input;
      const limit = input.limit ?? 50;

      const tweets = await ctx.prisma.tweet.findMany({
        cursor: cursor ? { createdAt_id: cursor } : undefined,
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
        where: {
          parentId: null,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (tweets.length > limit) {
        const nextItem = tweets.pop();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { createdAt, id } = nextItem!;
        nextCursor = { createdAt, id };
      }

      return { nextCursor, tweets };
    }),
});