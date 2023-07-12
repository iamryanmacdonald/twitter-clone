import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const usersRouter = createTRPCRouter({
  follow: protectedProcedure
    .input(z.object({ follow: z.boolean(), id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;
      const { follow, id } = input;

      if (follow) {
        const follow = await ctx.prisma.follow.create({
          data: {
            followedId: id,
            followerId: user.id,
          },
        });

        return follow;
      } else {
        const follow = await ctx.prisma.follow.delete({
          where: {
            followedId_followerId: {
              followedId: id,
              followerId: user.id,
            },
          },
        });

        return follow;
      }
    }),
  getByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { username } = input;

      const user = await ctx.prisma.user.findFirst({
        include: { followers: true },
        where: {
          username,
        },
      });

      if (!user || !ctx.session) return { user, following: false };

      const userId = ctx.session.user.id;

      const following = await ctx.prisma.follow.findFirst({
        where: {
          followedId: user.id,
          followerId: userId,
        },
      });

      return { user, following: following ? true : false };
    }),
});
