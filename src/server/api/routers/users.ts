import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const usersRouter = createTRPCRouter({
  getByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { username } = input;

      const user = await ctx.prisma.user.findFirst({
        include: { tweets: { include: { creator: true } } },
        where: {
          username,
        },
      });

      return user;
    }),
});
