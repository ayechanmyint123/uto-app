import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const shelvesRouter = createTRPCRouter({
    getShelvesByWarehouse: publicProcedure
    .input(z.object({ branchId: z.string()}))
    .query(async ({ ctx,input })=>{
        const shelves = await ctx.prisma.shelf.findMany({
            where: {
                warehouse: {
                    branchId : input.branchId
                }
            }
        });

      if (!shelves) throw new TRPCError({ code: "NOT_FOUND" });
    
      return shelves;
    })
})
