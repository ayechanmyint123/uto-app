import {z} from 'zod';
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


export const customersRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ctx}) => {
        const customers = await ctx.prisma.customer.findMany();
        return customers;
    }),
    getName: publicProcedure.query(async ({ctx} ) => {
        const customersname = await ctx.prisma.customer.findMany({
            select: {
                name: true,
            }
        });
        return customersname;
    }),
    // getNamesById: publicProcedure.query(async ({ctx, input}) => {
    //     const customersname = await ctx.
    // })
})