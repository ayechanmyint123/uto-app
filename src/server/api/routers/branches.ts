import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const branchesRouter = createTRPCRouter({
  getByLocationAndIndustry: publicProcedure
    .input(z.object({ type: z.string(), location: z.string() }))
    .query(async ({ ctx, input }) => {
      const branch = await ctx.prisma.branch.findMany({
        where: { industryId: input.type, location: input.location },
      });

      if (!branch) throw new TRPCError({ code: "NOT_FOUND" });

      return branch[0];
    }),
});
