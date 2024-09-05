import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";


export const warehousesRouter = createTRPCRouter({
    getWareHousesByIndustry: publicProcedure
        .input(z.object({branchId:z.string()}))
        .query(async ({ ctx,input }) => {
            const warehouses = await ctx.prisma.wareHouse.findMany({
                where: { branchId: input.branchId },
            });
            if(!warehouses) throw new TRPCError({ code: "NOT_FOUND"});

            return warehouses;
        }),
})