import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const tweetIncludes = {
  creator: {
    select: {
      image: true,
      name: true,
      username: true,
    },
  },
  likes: true,
  retweeted: {
    include: {
      creator: {
        select: {
          image: true,
          name: true,
          username: true,
        },
      },
    },
  },
  retweets: true,
};

export const tweetsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z
        .object({
          content: z.string().max(255),
          parentId: z.string().optional(),
          retweetedId: z.string().optional(),
        })
        .refine(
          ({ content, retweetedId }) =>
            !(retweetedId === undefined && content.length < 1)
        )
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;
      const { content, parentId, retweetedId } = input;

      const tweet = await ctx.prisma.tweet.create({
        data: {
          content,
          creatorId: user.id,
          parentId,
          retweetedId,
        },
        include: {
          creator: true,
        },
      });

      return tweet;
    }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;

      const tweet = await ctx.prisma.tweet.findUnique({
        include: tweetIncludes,
        where: {
          id,
        },
      });

      return tweet;
    }),
  getInfiniteByUsername: publicProcedure
    .input(
      z.object({
        cursor: z.object({ createdAt: z.date(), id: z.string() }).nullish(),
        limit: z.number().min(1).max(100).nullish(),
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, username } = input;
      const limit = input.limit ?? 50;

      const tweets = await ctx.prisma.tweet.findMany({
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        include: tweetIncludes,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: limit + 1,
        where: {
          creator: {
            username,
          },
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
        include: tweetIncludes,
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
  getRepliesById: publicProcedure
    .input(
      z.object({
        cursor: z.object({ createdAt: z.date(), id: z.string() }).nullish(),
        id: z.string(),
        limit: z.number().min(1).max(100).nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, id } = input;
      const limit = input.limit ?? 50;

      const replies = await ctx.prisma.tweet.findMany({
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        include: tweetIncludes,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: limit + 1,
        where: {
          parentId: id,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (replies.length > limit) {
        const nextItem = replies.pop();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { createdAt, id } = nextItem!;
        nextCursor = { createdAt, id };
      }

      return { nextCursor, replies };
    }),
  like: protectedProcedure
    .input(z.object({ id: z.string(), like: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;
      const { id, like } = input;

      if (like) {
        await ctx.prisma.like.create({
          data: {
            tweetId: id,
            userId: user.id,
          },
        });

        return true;
      } else {
        await ctx.prisma.like.delete({
          where: {
            tweetId_userId: {
              tweetId: id,
              userId: user.id,
            },
          },
        });

        return false;
      }
    }),
});
